export const speakPrompt = (text: string, language: 'en' | 'hi', onEnd?: () => void) => {
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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95; // Slightly slower for clarity in noisy hospitals
  utterance.pitch = 1.0;

  // Try to find natural sounding Premium/AI voices
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (language === 'hi') {
      const premiumHi = voices.find(v => 
        (v.lang.includes('hi') && (v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Premium')))
      );
      const standardHi = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
      utterance.voice = premiumHi || standardHi || null;
    } else {
      const premiumEn = voices.find(v => 
        ((v.lang === 'en-IN' || v.lang === 'en-US' || v.lang === 'en-GB') && 
        (v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')))
      );
      const standardEn = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
      utterance.voice = premiumEn || standardEn || null;
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

export const createSpeechRecognizer = (language: 'en' | 'hi', handlers: SpeechRecognizerHandlers) => {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (handlers.onError) handlers.onError('Speech recognition not supported in this browser.');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

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
