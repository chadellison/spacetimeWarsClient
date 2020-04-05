import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';

export const handleItems = (player) => {
  Object.values(player.items).forEach((item) => {
    switch (item.index) {
      case 0:
        if (item.durationCount >= item.cooldown) {
          if (player.hitpoints < player.maxHitpoints / 4) {
            item.durationCount = 0;
            player.hitpoints += (player.maxHitpoints / 2);
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
      default:
    }
    item.durationCount += ANAIMATION_FRAME_RATE;
  });
};

export const handleAbsorbDamage = (items) => {
  let absorbDamageItem = getItem(items, 4);
  absorbDamageItem.durationCount = 0;
}

export const canAbsorbDamage = (items) => {
  let item = getItem(items, 4);
  return item && item.durationCount >= item.cooldown
}

export const getItem = (items, id) => {
  if (items) {
    return items[id];
  }
}
