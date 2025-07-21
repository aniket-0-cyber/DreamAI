// src/sample-files/media-utils.ts

/**
 * Plays a media element and returns a promise that resolves when playback begins.
 * @param mediaEl The HTMLMediaElement (e.g., <audio> or <video>) to play.
 */
export async function playMedia(mediaEl: HTMLMediaElement): Promise<void> {
  try {
    await mediaEl.play();
  } catch (error) {
    console.error('Error attempting to play media:', error);
    throw error;
  }
}

/**
 * Pauses a media element.
 * @param mediaEl The HTMLMediaElement to pause.
 */
export function pauseMedia(mediaEl: HTMLMediaElement): void {
  mediaEl.pause();
}

/**
 * Toggles fullscreen mode for a video element.
 * @param videoEl The HTMLVideoElement to toggle fullscreen.
 */
export function toggleFullscreen(videoEl: HTMLVideoElement): void {
  if (!document.fullscreenElement) {
    videoEl.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

/**
 * Mutes or unmutes a media element.
 * @param mediaEl The HTMLMediaElement to toggle mute.
 */
export function toggleMute(mediaEl: HTMLMediaElement): void {
    mediaEl.muted = !mediaEl.muted;
} 