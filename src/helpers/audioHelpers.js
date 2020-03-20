import {thruster} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

const hasStealthMode = (player) => {
  return  player.items.filter((item) => item.id === 3).length > 0;
}

export const handleAudio = (player) => {
  const hasStealth = hasStealthMode(player);
  if (player.accelerate && !hasStealth) {
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

  if (player.gameEvent === 'fire' && !hasStealth) {
    const audio = WEAPONS[player.weaponIndex].sound
    audio.currentTime = 0
    const audioPromise = audio.play();
    if (audioPromise !== undefined) {
      audioPromise.catch((e) => console.log(e));
    }
  };
};
