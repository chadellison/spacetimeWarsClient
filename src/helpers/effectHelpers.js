import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';
import {GAME_EFFECTS} from '../constants/effects.js';

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

const randomGameEffect = () => {
  return GAME_EFFECTS[Math.floor(Math.random() * GAME_EFFECTS.length)];
}

export const applyGameBuff = (buffedPlayerId, players, elapsedTime) => {
  const gameEffect = randomGameEffect();
  return players.map((player) => {
    if (buffedPlayerId !== player.id) {
      player.effects = [...player.effects, {...gameEffect, durationCount: elapsedTime}];
    };
    return player;
  });
};
