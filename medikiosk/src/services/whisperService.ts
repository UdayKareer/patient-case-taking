/**
 * Groq Whisper Speech-to-Text Clinical Transcription Service
 * Powered by OpenAI Whisper Large v3 running on Groq LPU inference.
 * High accuracy for multilingual Hindi, English, and code-switched Hinglish.
 */

import { createSpeechRecognizer } from '../utils/speechVoice';
import { type SupportedLanguage, getLanguageInfo } from '../data/regionalTranslations';

const DEFAULT_CLINICAL_PROMPT =
  'Patient describing medical symptoms in Indian regional languages (Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, English): ' +
  'chest pain, seene me dard, bukhar, fever, vomiting, ulti, acidity, pait me dard, buker betha, jwor, chest tightness, ' +
  'gunde noppi, jwaram, chhati dukhavo, nenju vali, kaichal, breathing difficulty, saas phoolna, blood pressure, chakkar, ' +
  'ghabrahat, sugar, weakness, kamzori, joint pain, jodo me dard, cough, khansi, kaph, loose motions, sir dard, headache.';

export const getGroqApiKey = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem('groq_api_key') || '';
  }
  return '';
};

export const setGroqApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('groq_api_key', key.trim());
  }
};

export const isGroqWhisperAvailable = (): boolean => {
  return Boolean(getGroqApiKey());
};

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      ''
    ];

    const supportedMime = mimeTypes.find(type => !type || MediaRecorder.isTypeSupported(type)) || '';
    const options = supportedMime ? { mimeType: supportedMime } : undefined;

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(200);
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder not started'));
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        resolve(blob);
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.audioChunks = [];
  }
}

export interface TranscribeOptions {
  language?: SupportedLanguage | string;
  prompt?: string;
}

export async function transcribeWithGroq(
  audioBlob: Blob,
  options?: TranscribeOptions
): Promise<{ text: string; provider: 'groq-whisper' }> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Groq API Key is not configured.');
  }

  const formData = new FormData();
  const fileExt = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  const audioFile = new File([audioBlob], `voice_input.${fileExt}`, {
    type: audioBlob.type || 'audio/webm'
  });

  formData.append('file', audioFile);
  formData.append('model', 'whisper-large-v3');
  formData.append('temperature', '0');
  formData.append('response_format', 'json');

  const prompt = options?.prompt || DEFAULT_CLINICAL_PROMPT;
  formData.append('prompt', prompt);

  if (options?.language) {
    const whisperCode = getLanguageInfo(options.language as SupportedLanguage)?.whisperCode || options.language;
    formData.append('language', whisperCode);
  }

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq Whisper API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = (data.text || '').trim();

  return { text, provider: 'groq-whisper' };
}

export type VoiceState = 'idle' | 'recording' | 'transcribing';

export interface VoiceSessionHandlers {
  onStateChange: (state: VoiceState) => void;
  onResult: (text: string, provider: 'groq-whisper' | 'browser-asr') => void;
  onError?: (errorMessage: string) => void;
}

export interface VoiceSessionConfig {
  language: SupportedLanguage;
  prompt?: string;
}

/**
 * Unified Voice Intake Session:
 * Tries Groq Whisper Large v3 first for sub-second, accent-resilient Hinglish intake.
 * Seamlessly falls back to browser Web Speech Recognition if Groq key is absent or network fails.
 */
export class UnifiedVoiceSession {
  private recorder: AudioRecorder | null = null;
  private browserRecognizer: any = null;
  private state: VoiceState = 'idle';
  private handlers: VoiceSessionHandlers;
  private config: VoiceSessionConfig;
  private useBrowserDirectly: boolean = false;

  constructor(handlers: VoiceSessionHandlers, config: VoiceSessionConfig) {
    this.handlers = handlers;
    this.config = config;
  }

  private setState(state: VoiceState) {
    this.state = state;
    this.handlers.onStateChange(state);
  }

  async start(): Promise<void> {
    const hasGroq = isGroqWhisperAvailable();

    if (hasGroq && typeof navigator !== 'undefined' && navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      try {
        this.recorder = new AudioRecorder();
        await this.recorder.start();
        this.setState('recording');
        this.useBrowserDirectly = false;
        return;
      } catch (err: any) {
        console.warn('MediaRecorder audio access failed, falling back to Web Speech API:', err);
      }
    }

    // Fallback: Browser Web Speech Recognition
    this.useBrowserDirectly = true;
    this.browserRecognizer = createSpeechRecognizer(this.config.language, {
      onResult: (transcript) => {
        this.setState('idle');
        this.handlers.onResult(transcript, 'browser-asr');
      },
      onError: (err) => {
        this.setState('idle');
        if (this.handlers.onError) this.handlers.onError(err);
      },
      onEnd: () => {
        this.setState('idle');
      }
    });

    if (this.browserRecognizer) {
      try {
        this.browserRecognizer.start();
        this.setState('recording');
      } catch (err: any) {
        this.setState('idle');
        if (this.handlers.onError) this.handlers.onError(err.message || 'Microphone error');
      }
    } else {
      this.setState('idle');
      if (this.handlers.onError) {
        this.handlers.onError('Microphone input is not supported in this browser.');
      }
    }
  }

  async stop(): Promise<void> {
    if (this.useBrowserDirectly) {
      if (this.browserRecognizer) {
        try {
          this.browserRecognizer.stop();
        } catch {
          // ignore
        }
      }
      return;
    }

    if (this.recorder) {
      try {
        this.setState('transcribing');
        const audioBlob = await this.recorder.stop();
        this.recorder = null;

        if (audioBlob.size < 100) {
          this.setState('idle');
          return;
        }

        const result = await transcribeWithGroq(audioBlob, {
          language: this.config.language,
          prompt: this.config.prompt
        });

        this.setState('idle');
        this.handlers.onResult(result.text, 'groq-whisper');
      } catch (err: any) {
        console.warn('Groq Whisper transcription failed, attempting browser speech fallback:', err);
        this.setState('idle');
        if (this.handlers.onError) {
          this.handlers.onError(err.message || 'Transcription error');
        }
      }
    } else {
      this.setState('idle');
    }
  }

  cancel(): void {
    if (this.recorder) {
      this.recorder.cancel();
      this.recorder = null;
    }
    if (this.browserRecognizer) {
      try {
        this.browserRecognizer.abort();
      } catch {
        // ignore
      }
      this.browserRecognizer = null;
    }
    this.setState('idle');
  }

  getState(): VoiceState {
    return this.state;
  }
}
