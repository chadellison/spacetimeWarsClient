import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';
import {updateFrame} from '../helpers/animationHelpers.js';
import {round} from '../helpers/mathHelpers.js';

const RANDOME_GAME_BUFF_INDEX_LENGTH = 8

export const handleEffects = (player) => {
  Object.values(player.effects).forEach((effect) => {
    if (effect.durationCount > effect.duration) {
      delete player.effects[effect.id];
    } else {
      if (effect.id === 1) {
        const damage = round((player.maxHitpoints * 0.17) / (effect.duration / ANAIMATION_FRAME_RATE));
        const newHitpoints = player.hitpoints - damage;
        player.hitpoints = newHitpoints > 1 ? newHitpoints : 1;
      } else if (effect.id === 3) {
        const goldReduction = round((player.gold * 0.2) / (effect.duration / ANAIMATION_FRAME_RATE));
        player.gold -= goldReduction;
      } else if (effect.id === 7) {
        const health = round((player.maxHitpoints * 0.5) / (effect.duration / ANAIMATION_FRAME_RATE))
        const newHitpoints = player.hitpoints + health;
        player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
      };
      if (effect.animation) {
        updateFrame(effect.animation)
      }
      effect.durationCount += ANAIMATION_FRAME_RATE
    }
  });
};

export const randomBuffIndex = () => {
  return Math.floor(Math.random() * Math.floor(RANDOME_GAME_BUFF_INDEX_LENGTH));
}

export const applyGameBuff = (buffedPlayerId, players, gameBuff) => {
  return players.map((player) => {
    if (gameBuff.id < 5 && buffedPlayerId !== player.id) {
      player.effects = {...player.effects, [gameBuff.id]: {...gameBuff}};
    } else if (gameBuff.id > 4 && buffedPlayerId === player.id) {
      player.effects = {...player.effects, [gameBuff.id]: {...gameBuff}};
    };

    return player;
  });
};

export const updateGameBuff = (gameBuff) => {
  if (gameBuff.durationCount > gameBuff.duration) {
    return {};
  } else {
    return {...gameBuff, durationCount: gameBuff.durationCount + ANAIMATION_FRAME_RATE}
  }
};
