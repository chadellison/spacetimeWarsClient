import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  WEAPONS,
  SHIPS,
  SPRITE_WIDTH,
  SPRITE_ROW_COUNT,
  SPRITE_COLUMN_COUNT
} from '../constants/settings.js';

import {gameEventPayload} from '../helpers/sendEventHelpers';
import {handleItems} from '../helpers/itemHelpers';

export const updateGameState = ({
  players,
  elapsedTime,
  clockDifference,
  width,
  height,
  deployedWeapons,
  handleGameEvent,
  lastFired,
  isFiring,
  updateState,
  currentPlayer
}) => {
  let updatedPlayers = [];
  players.forEach((player) => {
    if (!removePlayer(player.explodeAnimation)) {
      if (player.hitpoints <= 0 && !player.explode && currentPlayer.id === player.id) {
        handleGameEvent({id: currentPlayer.id, gameEvent: 'remove'});
      }
      player = updatePlayer(player, elapsedTime, clockDifference);
      if (player.id === currentPlayer.id) {
        currentPlayer = player;
        handleRepeatedFire(player, handleGameEvent, lastFired, isFiring, updateState);
      }
      handleWall(player, width, height);
      updatedPlayers.push(player);
    };
  });

  if (deployedWeapons.length > 0) {
    const filteredWeapons = removeOutOfBoundsShots(deployedWeapons, width, height);
    deployedWeapons = handleWeapons(filteredWeapons, updatedPlayers, handleGameEvent, currentPlayer);
  };
  return {
    players: updatedPlayers,
    deployedWeapons: deployedWeapons,
    currentPlayer: currentPlayer
  };
};

export const canFire = (lastFired, cooldown) => {
  return Date.now() - lastFired > cooldown;
}

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;

  if (player.accelerate) {
    currentVelocity += player.velocity;
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

export const handleWeapons = (weapons, players, handleGameEvent, currentPlayer) => {
  return weapons.filter((weapon) => {
    weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
    weapon = handleCollision(weapon, players, handleGameEvent, currentPlayer)
    return !weapon.removed
  });
};

const removeOutOfBoundsShots = (weapons, width, height) => {
  return weapons.filter((weapon) => {
    return weapon.location.x > -50 &&
      weapon.location.x < width + 50 &&
      weapon.location.y > -50 &&
      weapon.location.y < height + 50
  });
};

const findShipBoundingBoxes = (player) => {
  const startCenter = SHIPS[player.shipIndex].shipCenter;
  const shipCenter = {x: player.location.x + startCenter.x, y: player.location.y + startCenter.y}

  return [
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 30),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -35)
  ];
}

const handleCollision = (weapon, players, handleGameEvent, currentPlayer) => {
  players.forEach((player) => {
    if (player.id !== weapon.playerId) {
      const shipBoundingBoxes = findShipBoundingBoxes(player);
      const weaponCenter = {x: weapon.location.x + (weapon.width / 2), y: weapon.location.y + (weapon.height / 2)}

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);
        if ((index < 3 && distance < 18) || (index > 2 && distance < 23)) {
          console.log('BLAM!');
          updateCollisionData(player, weapon, players, handleGameEvent, currentPlayer)
          weapon.removed = true
        }
      });
    };
  });
  return weapon;
}

const updateCollisionData = (player, weapon, players, handleGameEvent, currentPlayer) => {
  if (player.hitpoints > 0) {
    const damage = calculateDamage(weapon.damage, player.armor);
    let bounty = Math.round(damage / 10);
    player.hitpoints -= damage
    if (player.hitpoints <= 0 && weapon.playerId === currentPlayer.id) {
      bounty += Math.round(player.score / 10 + 100);
      handleGameEvent({id: player.id, gameEvent: 'remove'});
    }
    currentPlayer.gold += bounty
    currentPlayer.score += bounty
  };
};

const calculateDamage = (damage, armor) => {
  return Math.round(damage * (10 - armor) / 10);
}

export const handleFireWeapon = (player, weapon, deployedWeapons) => {
  const shipCenter = SHIPS[player.shipIndex].shipCenter;
  const x = player.location.x + shipCenter.x;
  const y = player.location.y + shipCenter.y;

  weapon.location = handleLocation(player.angle, {x, y}, 50);
  weapon.trajectory = player.angle
  weapon.playerId = player.id

  return [...deployedWeapons, weapon]
};

const findHypotenuse = (point, pointTwo) => {
  return Math.round(Math.sqrt((point.x - pointTwo.x) ** 2 + (point.y - pointTwo.y) ** 2))
};

export const handleRepeatedFire = (player, handleGameEvent, lastFired, isFiring, updateState) => {
  if (isFiring && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown)) {
    handleGameEvent(gameEventPayload(player, 'fire'));
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

export const handleWall = (player, width, height) => {
  if (player.location.x - 100 > width) {
    player.location.x = 0;
  }

  if (player.location.x + 100 < 0) {
    player.location.x = width;
  }

  if (player.location.y - 100 > height) {
    player.location.y = 0;
  }

  if (player.location.y + 100 < 0) {
    player.location.y = height;
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
