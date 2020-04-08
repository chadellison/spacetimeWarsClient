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
import {EFFECTS} from '../constants/effects.js';
import {handleItems, handleAbsorbDamage, canAbsorbDamage} from '../helpers/itemHelpers';
import {handleEffects, updateGameBuff, randomBuffIndex} from '../helpers/effectHelpers';

export const updateGameState = (gameState, updateState, handleGameEvent) => {
  let players = [...gameState.players];
  let deployedWeapons = [...gameState.deployedWeapons];
  let currentPlayer = {...gameState.currentPlayer};
  const {clockDifference, lastFired, space, gameBuff} = gameState;

  let updatedPlayers = [];
  players.forEach((player) => {
    if (!removePlayer(player.explodeAnimation)) {
      handleHitpoints(player, currentPlayer, handleGameEvent);
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);
      if (player.id === currentPlayer.id) {
        handleRepeatedFire(currentPlayer, handleGameEvent, lastFired, updateState, clockDifference, space);
        currentPlayer = player;
      }
      handleWall(player);
      updatedPlayers.push(player);
    };
  });

  if (deployedWeapons.length > 0) {
    const filteredWeapons = removeOutOfBoundsShots(deployedWeapons);
    deployedWeapons = handleWeapons(filteredWeapons, updatedPlayers, currentPlayer, handleGameEvent);
  };

  updatedPlayers.forEach((player) => handleEffects(player));
  handleCountDownEnd(currentPlayer, clockDifference);

  return {
    players: updatedPlayers,
    deployedWeapons: deployedWeapons,
    currentPlayer: currentPlayer,
    gameBuff: updateGameBuff(gameBuff)
  };
};

const handleHitpoints = (player, currentPlayer, handleGameEvent) => {
  if (player.hitpoints <= 0 && !player.explode) {
    if (currentPlayer.id === player.id) {
      handleGameEvent({id: currentPlayer.id, gameEvent: 'remove'});
    } else if (player.id === 'ai') {
      player.explodeAnimation = {x: 0, y: 0};
      player.explode = true;
    };
  };
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

  if (player.accelerate) {
    let playerVelocity = player.velocity;
    if (player.effects[2]) {
      playerVelocity /= 2;
    }
    currentVelocity += playerVelocity;
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = ((player.velocity) * 1000) - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  }
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return Math.round(currentVelocity * gameTime);
}

export const updatePlayer = (player, elapsedTime, clockDifference) => {
  player.angle = handleAngle(player, elapsedTime);
  const distance = distanceTraveled(player, elapsedTime, clockDifference);
  const trajectory = player.accelerate ? player.angle : player.trajectory;
  player.location = handleLocation(trajectory, player.location, distance);
  player.explodeAnimation = handleExplodeUpdate(player.explode, player.explodeAnimation);
  handleItems(player);
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
  const startCenter = player.id === 'ai' ? {x: 60, y: 30} : SHIPS[player.shipIndex].shipCenter;
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
    const damage = calculateDamage(weapon, player.armor);
    player.hitpoints -= damage;
    handleNegativeBuff(player, weapon)

    if (weapon.playerId === currentPlayer.id) {
      handlePositiveBuff(currentPlayer, weapon);
      let bounty = Math.round(damage / 10);
      if (player.hitpoints <= 0) {
        bounty += Math.round(player.gold / 10 + 100);
        if (player.id === 'ai') {
          handleGameEvent({...currentPlayer, gameEvent: 'buff', buffIndex: randomBuffIndex()});
        };
      };
      currentPlayer.gold += bounty;
      currentPlayer.score += bounty;
    };
  };
};

const handleNegativeBuff = (player, weapon) => {
  switch (weapon.index) {
    case 5:
      player.effects[EFFECTS[0].id] = {...EFFECTS[0]}
      break;
    case 6:
      player.effects[EFFECTS[1].id] = {...EFFECTS[1]}
      break
    default:
      break;
  }
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

const calculateDamage = (weapon, armor) => {
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
  return explodeAnimation && (explodeAnimation.x === (SPRITE_WIDTH * SPRITE_ROW_COUNT) && explodeAnimation.y === (SPRITE_WIDTH * SPRITE_COLUMN_COUNT));
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

const handleExplodeUpdate = (isExploding, explodeAnimation) => {
  if (isExploding) {
    if (explodeAnimation.x < (SPRITE_WIDTH * SPRITE_ROW_COUNT)) {
      explodeAnimation.x += SPRITE_WIDTH;
    } else if (explodeAnimation.x === (SPRITE_WIDTH * SPRITE_ROW_COUNT) && explodeAnimation.y < (SPRITE_WIDTH * SPRITE_COLUMN_COUNT)) {
      explodeAnimation.x = 0;
      explodeAnimation.y += SPRITE_WIDTH;
    } else {
      explodeAnimation = {};
    }
    return explodeAnimation;
  } else {
    return {};
  }
}

export const getUpdatedPlayers = (updatedPlayer, players) => {
  return players.map((player) => {
    if (player.id === updatedPlayer.id) {
      player = updatedPlayer;
    }
    return player;
  });
}
