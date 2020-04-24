import {thruster, supplyPop} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

export const handleAudio = (player) => {
  if (player.gameEvent === 'up') {
    thruster.currentTime = 0
    const playPromise = thruster.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(e));
    }
  } else if (player.gameEvent === 'upStop') {
    const pausePromise = thruster.pause();
    if (pausePromise !== undefined) {
      pausePromise.catch((e) => console.log(e));
    }
  } else if (player.gameEvent === 'fire') {
    const audio = WEAPONS[player.weaponIndex].sound
    audio.currentTime = 0
    const audioPromise = audio.play();
    if (audioPromise !== undefined) {
      audioPromise.catch((e) => console.log(e));
    }
  } else if (player.gameEvent === 'buff') {
    supplyPop.currentTime = 0
    const playPromise = supplyPop.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(e));
    }
  };
};
