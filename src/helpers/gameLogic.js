import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  SPRITE_WIDTH,
  SPRITE_ROW_COUNT,
  SPRITE_COLUMN_COUNT,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';
import {WEAPONS} from '../constants/weapons.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {handleItems, handleAbsorbDamage, canAbsorbDamage} from '../helpers/itemHelpers';
import {handleEffects, updateGameBuff, randomBuffIndex} from '../helpers/effectHelpers';
import {handleExplodeUpdate} from '../helpers/animationHelpers';

export const updateGameState = (gameState, updateState, handleGameEvent) => {
  let deployedWeapons = [...gameState.deployedWeapons];
  const {clockDifference, lastFired, space, gameBuff} = gameState;

  let updatedPlayerData = {players: [...gameState.players], currentPlayer: {...gameState.currentPlayer}}
  updatedPlayerData = updatePlayers(updatedPlayerData, handleGameEvent, clockDifference, lastFired, updateState, space);

  const filteredWeapons = removeOutOfBoundsShots(deployedWeapons);
  deployedWeapons = handleWeapons(filteredWeapons, updatedPlayerData.players, updatedPlayerData.currentPlayer, handleGameEvent);
  handleCountDownEnd(updatedPlayerData.currentPlayer, clockDifference);

  return {
    players: updatedPlayerData.players,
    deployedWeapons: deployedWeapons,
    currentPlayer: updatedPlayerData.currentPlayer,
    gameBuff: updateGameBuff(gameBuff)
  };
};

const updatePlayers = (updatedPlayerData, handleGameEvent, clockDifference, lastFired, updateState, space) => {
  let updatedPlayers = [];
  updatedPlayerData.players.forEach((player) => {
    if (!removePlayer(player.explodeAnimation)) {
      handleHitpoints(player, updatedPlayerData.currentPlayer.id, handleGameEvent);
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);
      if (player.id === updatedPlayerData.currentPlayer.id) {
        handleRepeatedFire(updatedPlayerData.currentPlayer, handleGameEvent, lastFired, updateState, clockDifference, space);
        updatedPlayerData.currentPlayer = player
      }
      handleWall(player);
      if (player.type !== 'ai') {
        handleEffects(player)
      }
      updatedPlayers.push(player);
    };
  });
  updatedPlayerData.players = updatedPlayers;
  return updatedPlayerData;
}

const handleHitpoints = (player, currentPlayerId, handleGameEvent) => {
  if (player.hitpoints <= 0 && !player.explode) {
    if (player.killedBy) {
      if (player.killedBy === currentPlayerId) {
        handleGameEvent({id: player.id, gameEvent: 'remove'});
      }
    } else {
      if (currentPlayerId === player.id) {
        handleGameEvent({id: player.id, gameEvent: 'remove'});
      }
    }
  }
};

export const canFire = (lastFired, cooldown) => {
  return Date.now() - lastFired > cooldown;
}

const handleCountDownEnd = (currentPlayer, clockDifference) => {
  if (currentPlayer.explode) {
    const elapsedSeconds = findElapsedTime(clockDifference, currentPlayer.updatedAt) / 1000;
    if (elapsedSeconds >= 10) {
      currentPlayer.explode = false;
      currentPlayer.gameEvent = 'waiting';
    };
  };
}

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;
  let playerVelocity = player.effects[2] ? 1 : player.velocity;

  if (player.accelerate) {
    currentVelocity += playerVelocity;
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = ((playerVelocity) * 1000) - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  }
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return Math.round(currentVelocity * gameTime);
}

export const updatePlayer = (player, elapsedTime, clockDifference) => {
  if (!player.effects[4]) {
    player.angle = handleAngle(player, elapsedTime);
    const distance = distanceTraveled(player, elapsedTime, clockDifference);
    const trajectory = player.accelerate ? player.angle : player.trajectory;
    player.location = handleLocation(trajectory, player.location, distance);
  }
  player.explodeAnimation = handleExplodeUpdate(player.explode, player.explodeAnimation);
  if (player.type !== 'ai') {
    handleItems(player);
  }
  return player
}

export const handleWeapons = (weapons, players, currentPlayer, handleGameEvent) => {
  return weapons.filter((weapon) => {
    weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
    weapon = handleCollision(weapon, players, currentPlayer, handleGameEvent)
    return !weapon.removed
  });
};

const removeOutOfBoundsShots = (weapons) => {
  return weapons.filter((weapon) => {
    return weapon.location.x > -50 &&
      weapon.location.x < BOARD_WIDTH + 50 &&
      weapon.location.y > -50 &&
      weapon.location.y < BOARD_HEIGHT + 50
  });
};

const findShipBoundingBoxes = (player) => {
  const startCenter = player.type === 'ai' ? {x: 60, y: 30} : SHIPS[player.shipIndex].shipCenter;
  const shipCenter = {x: player.location.x + startCenter.x, y: player.location.y + startCenter.y}

  return [
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 30),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -35)
  ];
}

const handleCollision = (weapon, players, currentPlayer, handleGameEvent) => {
  players.forEach((player) => {
    if (player.id !== weapon.playerId) {
      const shipBoundingBoxes = findShipBoundingBoxes(player);
      const weaponCenter = {x: weapon.location.x + (weapon.width / 2), y: weapon.location.y + (weapon.height / 2)}

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);
        if ((index < 3 && distance < 18) || (index > 2 && distance < 23)) {
          applyHit(player, weapon, currentPlayer, handleGameEvent);
        }
      });
    };
  });
  return weapon;
}

const applyHit = (player, weapon, currentPlayer, handleGameEvent) => {
  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    console.log('BLAM!');
    updateCollisionData(player, weapon, currentPlayer, handleGameEvent)
  }
  weapon.removed = true
};

const updateCollisionData = (player, weapon, currentPlayer, handleGameEvent) => {
  if (player.hitpoints > 0) {
    const damage = calculateDamage(weapon, player);
    player.hitpoints -= damage;
    handleNegativeBuff(player, weapon);

    if (weapon.playerId === currentPlayer.id) {
      handlePositiveBuff(currentPlayer, weapon);
      let bounty = Math.round(damage / 10);
      if (player.hitpoints <= 0) {
        bounty += Math.round(player.score * 0.01 + 100);
        handleKill(player, currentPlayer, handleGameEvent);
        player.killedBy = weapon.playerId
      };
      currentPlayer.gold += bounty;
      currentPlayer.score += bounty;
    };
  };
};

const handleKill = (player, currentPlayer, handleGameEvent) => {
  if (player.type === 'ai') {
    handleGameEvent({...currentPlayer, gameEvent: 'buff', buffIndex: randomBuffIndex()});
  } else {
    currentPlayer.consecutiveKills += 1
    if (currentPlayer.consecutiveKills >= 5) {
      handleGameEvent({...currentPlayer, gameEvent: 'gameOver'});
    }
  }
}

const handleNegativeBuff = (player, weapon) => {
  if (weapon.index === 5) {
    player.effects[GAME_EFFECTS[0].id] = {...GAME_EFFECTS[0], duration: 3000}
  } else if (weapon.index === 6) {
    player.effects[GAME_EFFECTS[1].id] = {...GAME_EFFECTS[1], duration: 1000}
  }

  if (weapon.canStun && Math.random() <= 0.1) {
    player.effects[GAME_EFFECTS[3].id] = {...GAME_EFFECTS[3], duration: 2000}
  };
}

const handlePositiveBuff = (player, weapon) => {
  if (weapon.index === 3) {
    let newHitpoints = player.hitpoints + Math.round(weapon.damage / 15);
    if (newHitpoints > player.maxHitpoints) {
      newHitpoints = player.maxHitpoints;
    }
    player.hitpoints = newHitpoints;
  }
}

const calculateDamage = (weapon, player) => {
  let armor = player.armor;

  if (player.effects[8]) {
    armor += 4;
  } else if (weapon.index === 7) {
    armor = 0;
  }

  let damage = weapon.damage;
  if (weapon.index === 4 && Math.random() >= 0.8) {
    damage *= 2
  }
  return Math.round(damage * (10 - armor) / 10);
}

export const handleFireWeapon = (player, clockDifference) => {
  const elapsedTime = findElapsedTime(clockDifference, player.updatedAt);
  const angle = handleAngle(player, elapsedTime);
  const distance = distanceTraveled(player, elapsedTime, clockDifference);
  const location = handleLocation(angle, player.location, distance);

  let weapon = {...WEAPONS[player.weaponIndex]}
  const shipCenter = SHIPS[player.shipIndex].shipCenter;
  const x = location.x + shipCenter.x;
  const y = location.y + shipCenter.y;

  weapon.location = handleLocation(angle, {x, y}, 50);
  weapon.trajectory = angle
  weapon.playerId = player.id
  weapon.damage = player.damage
  weapon.canStun = player.items[6]

  return weapon;
};

const findHypotenuse = (point, pointTwo) => {
  return Math.round(Math.sqrt((point.x - pointTwo.x) ** 2 + (point.y - pointTwo.y) ** 2))
};

export const handleRepeatedFire = (player, handleGameEvent, lastFired, updateState, clockDifference, spaceKeyPressed) => {
  if (spaceKeyPressed && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown)) {
    handleGameEvent({...player, gameEvent: 'fire'});
    updateState({lastFired: Date.now()});
  };
};

const removePlayer = (explodeAnimation) => {
  return (explodeAnimation.x === (SPRITE_WIDTH * SPRITE_ROW_COUNT) && explodeAnimation.y === (SPRITE_WIDTH * SPRITE_COLUMN_COUNT));
}

export const findElapsedTime = (clockDifference, updatedAt) => {
  const currentTime = Date.now();
  return currentTime + clockDifference - updatedAt;
}

export const handleLocation = (trajectory, location, distance) => {
  const radians = trajectory * Math.PI / 180
  const x = Math.round(location.x + Math.cos(radians) * distance)
  const y = Math.round(location.y + Math.sin(radians) * distance)
  return {x: x, y: y}
}

export const handleAngle = (player, elapsedTime) => {
  switch (player.rotate) {
    case 'left':
      const angle = (player.angle - 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360;
      return angle < 0 ? 360 - angle : angle;
    case 'right':
      return (player.angle + 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360
    default:
      return player.angle;
  };
}

export const handleWall = (player) => {
  if (player.location.x - 100 > BOARD_WIDTH) {
    player.location.x = 0;
  }

  if (player.location.x + 100 < 0) {
    player.location.x = BOARD_WIDTH;
  }

  if (player.location.y - 100 > BOARD_HEIGHT) {
    player.location.y = 0;
  }

  if (player.location.y + 100 < 0) {
    player.location.y = BOARD_HEIGHT;
  }
};

export const getUpdatedPlayers = (updatedPlayer, players) => {
  return players.map((player) => {
    if (player.id === updatedPlayer.id) {
      player = updatedPlayer;
    }
    return player;
  });
}
