import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';

export const handleEffects = (player) => {
  player.effects = player.effects.filter((effect) => {
    return effect.durationCount < effect.duration;
  });

  player.effects.forEach((effect) => {
    if (effect.index === 0) {
      const damage = Math.round((player.maxHitpoints / 15) / (effect.duration / ANAIMATION_FRAME_RATE));
      player.hitpoints -= damage;
    };
    effect.durationCount += ANAIMATION_FRAME_RATE
  });
};
