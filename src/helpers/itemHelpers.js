export const handleItems = (player) => {
  if (player.items) {
    const currentTime = Date.now();
    player.items.forEach((item) => {
      switch (item.id) {
        case 1:
        if (currentTime - item.lastUpdated >= 120 * 1000) {
          if (player.hitpoints < player.maxHitpoints / 4) {
            item.lastUpdated = currentTime;
            player.hitpoints += (player.maxHitpoints / 2);
          }
        }
        break;
        case 2:
        if (currentTime - item.lastUpdated >= 1000) {
          item.lastUpdated = currentTime;
          const newHitpoints = Math.round(player.maxHitpoints * 0.01 + player.hitpoints);
          player.hitpoints = newHitpoints > player.maxHitpoints ? player.maxHitpoints : newHitpoints;
        }
        break;
        default:
      }
    })
  };
};
