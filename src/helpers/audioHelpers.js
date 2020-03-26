import {thruster} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';
import {getItem} from '../helpers/itemHelpers.js';

export const handleAudio = (player) => {
  const hasStealth = getItem(player.items, 3);
  if (player.gameEvent === 'up' && !hasStealth) {
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
