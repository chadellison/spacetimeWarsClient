import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  DRIFT_DECAY_TIME,
  SHIP,
  WEAPONS
} from '../constants/settings.js';

import {handleExplodeEvent} from './eventHelpers.js';

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;

  if (player.accelerate) {
    currentVelocity += player.velocity;
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = DRIFT_DECAY_TIME - timeSinceLastAcceleration;
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
  return player
}

export const handleWeapons = (weapons, width, height, players, handleGameEvent) => {
  const updatedWeapons = weapons.filter((weapon) => {
    weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
    weapon = handleCollision(weapon, players, handleGameEvent)
    return !weapon.removed
  });

  return updatedWeapons.filter((weapon) => {
    return weapon.location.x > -50 &&
      weapon.location.x < width + 50 &&
      weapon.location.y > -50 &&
      weapon.location.y < height + 50
  });
};

const handleCollision = (weapon, players, handleGameEvent) => {
  players.forEach((player) => {
    if (player.id !== weapon.playerId) {
      const shipCenter = {x: player.location.x + SHIP.shipCenter.x, y: player.location.y + SHIP.shipCenter.y}

      const shipBoundingBoxes = [
        handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 30),
        handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 10),
        handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -10),
        handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -35)
      ];
      const weaponCenter = {x: weapon.location.x + 8, y: weapon.location.y + 8}

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);
        if ((index < 3 && distance < 18) || (index > 2 && distance < 23)) {
          console.log('BLAM!')
          player.hitpoints = updateHitpoints(weapon.damage, player.hitpoints, player.armor)
          if (player.hitpoints < 0) {
            handleGameEvent(handleExplodeEvent(player));
          }
          weapon.removed = true
        }
      });
    };
  });
  return weapon;
}

const updateHitpoints = (damage, hitpoints, armor) => {
  return Math.round(hitpoints - (damage * (10 - armor) / 10));
}

export const handleFireWeapon = (player, weapon, deployedWeapons) => {
  if (player.lastEvent === 'fire') {
    const x = player.location.x + SHIP.shipCenter.x;
    const y = player.location.y + SHIP.shipCenter.y;

    weapon.location = handleLocation(player.angle, {x, y}, 50);
    weapon.trajectory = player.angle
    weapon.playerId = player.id

    return [...deployedWeapons, weapon]
  } else {
    return deployedWeapons;
  }
};

export const findCurrentPlayer = (players, playerId) => {
  return players.filter((player) => player.id === playerId)[0];
};

const findHypotenuse = (point, pointTwo) => {
  return Math.round(Math.sqrt((point.x - pointTwo.x) ** 2 + (point.y - pointTwo.y) ** 2))
};

export const updateGameState = ({
  players,
  elapsedTime,
  clockDifference,
  width,
  height,
  deployedWeapons,
  handleGameEvent
}) => {
  const updatedPlayers = players.map((player) => {
    player = updatePlayer(player, elapsedTime, clockDifference);
    handleWall(player, width, height);
    handleRepeatedFire(player, clockDifference, handleGameEvent);
    return player;
  });

  if (deployedWeapons.length > 0) {
    deployedWeapons = handleWeapons(deployedWeapons, width, height, updatedPlayers, handleGameEvent);
  };
  return {players: updatedPlayers, deployedWeapons: deployedWeapons};
}

export const handleRepeatedFire = (player, clockDifference, handleGameEvent) => {
  const elapsedTime = findElapsedTime(clockDifference, player.lastFired)
  const weaponCooldown = WEAPONS[player.weapon].cooldown;
  const canFire = elapsedTime > weaponCooldown;

  if (player.fire && canFire) {
    handleGameEvent({
      id: player.id,
      gameEvent: 'fire',
      location: player.location,
      angle: player.angle
    });
  };
};

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
}
