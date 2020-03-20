export const handleItems = (player) => {
  const currentTime = Date.now();
  player.items.forEach((item) => {
    switch (item.id) {
      case 1:
      if (currentTime - item.lastUpdated >= item.cooldown) {
        if (player.hitpoints < player.maxHitpoints / 4) {
          item.lastUpdated = currentTime;
          player.hitpoints += (player.maxHitpoints / 2);
        }
      }
      break;
      case 2:
      if (currentTime - item.lastUpdated >= item.cooldown) {
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
    return items.filter((item) => item.id === id)[0];
  }
}
