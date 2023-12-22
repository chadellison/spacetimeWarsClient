import { ANIMATION_FRAME_RATE } from '../constants/settings.js';
import { updateFrame } from '../helpers/animationHelpers.js';
import { round } from '../helpers/mathHelpers.js';
import { GAME_EFFECTS } from '../constants/effects.js';

export const handleEffects = (player) => {
  Object.values(player.effects).forEach(effect => {
    if (effect.durationCount > effect.duration) {
      delete player.effects[effect.id];
    } else {
      if (effect.id === 1) {
        const damage = (round(player.maxHitpoints * 0.002)) || 1;
        player.hitpoints -= damage;
      } else if (effect.id === 7) {
        const health = round((player.maxHitpoints * 0.5) / (effect.duration / ANIMATION_FRAME_RATE))
        const newHitpoints = player.hitpoints + health;
        player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
      } else if (effect.id === 13) {
        player.hitpoints -= 4;
      } else if (effect.id === 15) {
        const multiplyer = player.type === 'bomber' && ['redMothership', 'blueMothership'].includes(player.name) ? 0.002 : 0.01;
        const damage = (round(player.maxHitpoints * multiplyer)) || 1;
        player.hitpoints -= damage;
      };
      player.killedBy = player.hitpoints <= 0 ? effect.attackerId : null;

      if (effect.animation) {
        updateFrame(effect.animation);
      }
      effect.durationCount += ANIMATION_FRAME_RATE
    }
  });
};

export const applyGameBuff = (team, players, gameBuff) => {
  return players.map(player => {
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
          coordinates: { x: 0, y: 0 }
        }
      }
    };
  } else {
    return { ...effects, [effect.id]: effect };
  }
};

const handleEffectAnimation = (effect, existingEffect) => {
  if (effect.animation) {
    return existingEffect ? existingEffect.animation : { ...effect.animation, coordinates: { x: 0, y: 0 } };
  } else {
    return null;
  }
};

export const createEffect = (index, duration, existingEffect, attackerId) => {
  const effect = { ...GAME_EFFECTS[index] };
  return {
    ...effect,
    duration,
    attackerId,
    animation: handleEffectAnimation(effect, existingEffect)
  };
};

export const updateGameBuff = (gameBuff) => {
  if (gameBuff.durationCount > gameBuff.duration) {
    return {};
  } else {
    return { ...gameBuff, durationCount: gameBuff.durationCount + ANIMATION_FRAME_RATE };
  }
};
