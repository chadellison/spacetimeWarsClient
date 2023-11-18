import { ANAIMATION_FRAME_RATE } from '../constants/settings.js';
import { GAME_EFFECTS } from '../constants/effects.js';

export const handleItems = (player) => {
  Object.values(player.items).forEach(item => {
    switch (item.index) {
      case 0:
        if (item.durationCount >= item.cooldown && player.hitpoints < player.maxHitpoints / 4) {
          item.durationCount = 0;
          const effect = { ...GAME_EFFECTS[item.effectIndex] };
          player.effects = { ...player.effects, [effect.id]: effect }
        }
        break;
      case 1:
        if (item.durationCount >= item.cooldown && player.hitpoints < player.maxHitpoints) {
          item.durationCount = 0;
          const newHitpoints = Math.round(player.maxHitpoints * 0.01 + player.hitpoints);
          player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
        }
        break;
      case 2:
        if (item.durationCount >= item.cooldown && player.hitpoints < player.maxHitpoints / 4) {          
          item.durationCount = 0;
          const effect = { ...GAME_EFFECTS[item.effectIndex], duration: 6000 };
          player.effects = { ...player.effects, [effect.id]: effect }
        };
        break;
      case 3:
        if (item.durationCount >= item.cooldown) {
          const effect = { ...GAME_EFFECTS[item.effectIndex] };
          player.effects = { ...player.effects, [effect.id]: effect }
        }
        break;
      case 4:
        if (item.durationCount >= item.cooldown && player.hitpoints < player.maxHitpoints / 3) {          
          item.durationCount = 0;
          const gameBuff = { ...GAME_EFFECTS[item.effectIndex], duration: 15000 };
          player.effects = { ...player.effects, [gameBuff.id]: gameBuff }
        }
        break;
      default:
        break;
    }
    item.durationCount += ANAIMATION_FRAME_RATE;
  });
};

export const handleAbsorbDamage = (player) => {
  if (!player.effects[6]) {
    const absorbDamageItem = getItem(player.items, 4);
    absorbDamageItem.durationCount = 0;
    const effectId = GAME_EFFECTS[absorbDamageItem.effectIndex].id;
    delete player.effects[effectId];
  };
};

export const canAbsorbDamage = (player) => player.effects[6] || player.effects[16];

export const getItem = (items, id) => {
  if (items) {
    return items[id];
  }
};
