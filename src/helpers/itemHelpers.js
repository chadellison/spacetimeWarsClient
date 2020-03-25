export const handleItems = (player) => {
  const currentTime = Date.now();
  Object.values(player.items).forEach((item) => {
    switch (item.index) {
      case 0:
      if (currentTime - item.lastUpdated >= item.cooldown) {
        if (player.hitpoints < player.maxHitpoints / 4) {
          item.lastUpdated = currentTime;
          player.hitpoints += (player.maxHitpoints / 2);
        }
      }
      break;
      case 1:
      if (currentTime - item.lastUpdated >= item.cooldown && player.hitpoints < player.maxHitpoints) {
        item.lastUpdated = currentTime;
        const newHitpoints = Math.round(player.maxHitpoints * 0.01 + player.hitpoints);
        player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
      }
      break;
      default:
    }
  })
};

export const handleAbsorbDamage = (items) => {
  let absorbDamageItem = getItem(items, 4);
  absorbDamageItem.lastUpdated = Date.now();
}

export const canAbsorbDamage = (items) => {
  let absorbDamageItem = getItem(items, 4);
  if (absorbDamageItem) {
    return Date.now() - absorbDamageItem.lastUpdated >= absorbDamageItem.cooldown;
  } else {
    return false;
  }
}

export const getItem = (items, id) => {
  if (items) {
    return items[id];
  }
}
