import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';
import {GAME_EFFECTS} from '../constants/effects.js';

export const handleItems = (player) => {
  Object.values(player.items).forEach((item) => {
    switch (item.index) {
      case 0:
        if (item.durationCount >= item.cooldown) {
          if (player.hitpoints < player.maxHitpoints / 4) {
            item.durationCount = 0;
            const gameBuff = {...GAME_EFFECTS[5], duration: 4000};
            player.effects = {...player.effects, [gameBuff.id]: gameBuff}
          }
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
        if (item.durationCount >= item.cooldown) {
          if (player.hitpoints < player.maxHitpoints / 4) {
            item.durationCount = 0;
            const gameBuff = {...GAME_EFFECTS[3], duration: 6000};
            player.effects = {...player.effects, [gameBuff.id]: gameBuff}
          };
        };
        break;
      default:
    }
    item.durationCount += ANAIMATION_FRAME_RATE;
  });
};

export const handleAbsorbDamage = (player) => {
  if (!player.effects[5]) {
    let absorbDamageItem = getItem(player.items, 4);
    absorbDamageItem.durationCount = 0;
  };
};

export const canAbsorbDamage = (player) => {
  const item = getItem(player.items, 4);
  return (player.effects[5]) || (item && item.durationCount >= item.cooldown)
};

export const getItem = (items, id) => {
  if (items) {
    return items[id];
  }
}
