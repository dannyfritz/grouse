import { Howl } from "howler";
import blipSoundAsset from "./sounds/blip.wav";
import hitSoundAsset from "./sounds/hit.wav";
import {
  getAudioQueue,
  SOUND_BLIP,
  SOUND_HIT,
} from "./constants";

const blipSound = new Howl({
  src: [blipSoundAsset],
  volume: 0.1,
});
const hitSound = new Howl({
  src: [hitSoundAsset],
  volume: 0.2,
});

export const audio = (state) => {
  const queue = getAudioQueue(state);
  for (let i = 0; i < queue.length; i += 1) {
    const soundId = queue[i];
    switch (soundId) {
      case SOUND_BLIP:
        blipSound.play();
        break;
      case SOUND_HIT:
        hitSound.play();
        break;
      default:
        break;
    }
  }
};
