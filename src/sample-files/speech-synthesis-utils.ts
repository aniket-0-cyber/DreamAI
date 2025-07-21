// src/sample-files/speech-synthesis-utils.ts

/**
 * Speaks a given text using the Web Speech API.
 * @param text The text to speak.
 * @param lang The language to use.
 * @param rate The speech rate.
 * @param pitch The speech pitch.
 */
export function speak(
  text: string,
  lang: string = 'en-US',
  rate: number = 1,
  pitch: number = 1
): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis API not supported.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.speak(utterance);
}

/**
 * Cancels any ongoing speech.
 */
export function cancelSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Gets a list of available speech synthesis voices.
 * @returns A promise that resolves with an array of available voices.
 */
export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
} 