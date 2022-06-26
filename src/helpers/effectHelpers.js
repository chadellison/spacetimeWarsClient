import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';
import {updateFrame} from '../helpers/animationHelpers.js';
import {round} from '../helpers/mathHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';

export const handleEffects = (player) => {
  Object.values(player.effects).forEach((effect) => {
    if (effect.durationCount > effect.duration) {
      delete player.effects[effect.id];
    } else {
      if (effect.id === 1) {
        const multiplyer = player.type === 'bomber' && player.name === 'mothership' ? 0.05 : 0.17;
        const damage = round((player.maxHitpoints * multiplyer) / (effect.duration / ANAIMATION_FRAME_RATE));
        const newHitpoints = player.hitpoints - damage;
        player.hitpoints = newHitpoints > 1 ? newHitpoints : 1;
      } else if (effect.id === 7) {
        const health = round((player.maxHitpoints * 0.5) / (effect.duration / ANAIMATION_FRAME_RATE))
        const newHitpoints = player.hitpoints + health;
        player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
      } else if (effect.id === 13) {
        const newHitpoints = player.hitpoints - 25;
        player.hitpoints = newHitpoints > 1 ? newHitpoints : 0;
      };
      if (effect.animation) {
        updateFrame(effect.animation)
      }
      effect.durationCount += ANAIMATION_FRAME_RATE
    }
  });
};

export const applyGameBuff = (team, players, gameBuff) => {
  return players.map((player) => {
    if (gameBuff.id < 5 && team !== player.team) {
      player.effects = updateEffects(player.effects, gameBuff);
    } else if (gameBuff.id > 4 && team === player.team) {
      player.effects = updateEffects(player.effects, gameBuff);
    };

    return player;
  });
};

const updateEffects = (effects, effect) => {
  if (effect.animation) {
    return {
      ...effects,
      [effect.id]: {
        ...effect,
        animation: {
          ...effect.animation,
          coordinates: {x: 0, y: 0}
        }
      }
    };
  } else {
    return {...effects, [effect.id]: effect};
  }
}

export const createEffect = (index, duration, existingEffect) => {
  const effect = {...GAME_EFFECTS[index]};
  return {
    ...effect,
    duration,
    animation: existingEffect ? existingEffect.animation : {...effect.animation, coordinates: {x: 0, y: 0} }
  }
}

export const updateGameBuff = (gameBuff) => {
  if (gameBuff.durationCount > gameBuff.duration) {
    return {};
  } else {
    return {...gameBuff, durationCount: gameBuff.durationCount + ANAIMATION_FRAME_RATE}
  }
};
