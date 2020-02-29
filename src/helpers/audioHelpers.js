import {WEAPONS, thruster} from '../constants/settings.js';

export const handleAudio = (player) => {
  if (player.accelerate) {
    thruster.currentTime = 0
    const playPromise = thruster.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(e));
    }
  } else {
    const pausePromise = thruster.pause();
    if (pausePromise !== undefined) {
      pausePromise.catch((e) => console.log(e));
    }
  };

  if (player.lastEvent === 'fire') {
    const audio = WEAPONS[player.weaponIndex].sound
    audio.currentTime = 0
    const audioPromise = audio.play();
    if (audioPromise !== undefined) {
      audioPromise.catch((e) => console.log(e));
    }
  };
};
