import { type SupportedLanguage, getLanguageInfo } from '../data/regionalTranslations';

export const speakPrompt = (
  text: string,
  language: SupportedLanguage = 'en',
  onEnd?: () => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || text.trim() === '') {
    if (onEnd) onEnd();
    return;
  }

  const langInfo = getLanguageInfo(language);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langInfo.bcp47;
  utterance.rate = 0.92; // Slightly measured for clinical clarity in regional languages
  utterance.pitch = 1.0;

  // Find natural sounding native voices installed on Android/iOS/Windows/Chrome
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const langCode = langInfo.code;
    const langNameLower = langInfo.name.toLowerCase();

    // 1. Check for high-quality / online / natural regional voice
    const premiumRegional = voices.find((v) => {
      const matchLang = v.lang.toLowerCase().startsWith(langCode) || v.lang.toLowerCase() === langInfo.bcp47.toLowerCase();
      const matchName = v.name.toLowerCase().includes(langNameLower);
      const isHighQuality =
        v.name.includes('Online') ||
        v.name.includes('Google') ||
        v.name.includes('Natural') ||
        v.name.includes('Premium');
      return (matchLang || matchName) && isHighQuality;
    });

    // 2. Fallback to any voice matching regional language
    const standardRegional = voices.find((v) => {
      return (
        v.lang.toLowerCase().startsWith(langCode) ||
        v.lang.toLowerCase() === langInfo.bcp47.toLowerCase() ||
        v.name.toLowerCase().includes(langNameLower)
      );
    });

    if (premiumRegional) {
      utterance.voice = premiumRegional;
    } else if (standardRegional) {
      utterance.voice = standardRegional;
    }
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export interface SpeechRecognizerHandlers {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export const createSpeechRecognizer = (
  language: SupportedLanguage = 'en',
  handlers: SpeechRecognizerHandlers
) => {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (handlers.onError) handlers.onError('Speech recognition not supported in this browser.');
    return null;
  }

  try {
    const langInfo = getLanguageInfo(language);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langInfo.bcp47;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handlers.onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      if (handlers.onError) handlers.onError(event.error);
    };

    recognition.onend = () => {
      if (handlers.onEnd) handlers.onEnd();
    };

    return recognition;
  } catch (err: any) {
    if (handlers.onError) handlers.onError(err.message || 'Speech error');
    return null;
  }
};

