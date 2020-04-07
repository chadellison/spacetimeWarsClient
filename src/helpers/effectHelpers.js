import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';
import {GAME_EFFECTS} from '../constants/effects.js';

export const handleEffects = (player) => {
  player.effects = player.effects.filter((effect) => {
    return effect.durationCount < effect.duration;
  });

  player.effects.forEach((effect) => {
    if (effect.id === 1) {
      const damage = Math.round((player.maxHitpoints * 0.15) / (effect.duration / ANAIMATION_FRAME_RATE));
      player.hitpoints -= damage;
    };
    effect.durationCount += ANAIMATION_FRAME_RATE
  });
};

export const randomBuffIndex = () => {
  return Math.floor(Math.random() * Math.floor(GAME_EFFECTS.length));
}

export const applyGameBuff = (buffedPlayerId, players, elapsedTime, gameBuff) => {
  return players.map((player) => {
    switch (gameBuff.id) {
      case 1:
      case 2:
      case 3:
        if (buffedPlayerId !== player.id && player.id !== 'ai') {
          player.effects = [...player.effects, {...gameBuff}];
        };
        break;
      case 4:
        if (buffedPlayerId === player.id) {
          player.effects = [...player.effects, {...gameBuff}];
        }
        break;
      default:
        break;
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
