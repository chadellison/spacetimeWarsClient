import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  explosionSound,
  mineTriggerSound,
  zapSound,
} from '../constants/settings.js';
import { SHIPS, BOMBERS, MOTHER_SHIP } from '../constants/ships.js';
import { WEAPONS, EXPLOSION_ANIMATIONS } from '../constants/weapons.js';
import { handleItems, handleAbsorbDamage, canAbsorbDamage, getItem } from '../helpers/itemHelpers';
import { handleEffects, updateGameBuff, createEffect } from '../helpers/effectHelpers';
import { updateAnimation } from '../helpers/animationHelpers';
import { round, angleFromCoordinates } from '../helpers/mathHelpers.js';
import { updateFrame } from '../helpers/animationHelpers.js';
import { playSound } from '../helpers/audioHelpers.js';
import { explodePlayer } from '../helpers/receiveEventHelpers.js';
import { upgradeSound, GAME_ANIMATIONS } from '../constants/settings.js';

export const updateGameState = (gameState, handleGameEvent, currentPlayer) => {
  const { clockDifference, gameBuff, userId, aiShips, space, lastFired, motherships, connected } = gameState;
  let updatedPlayers = updatePlayers(gameState, handleGameEvent, connected);

  let { newLastFired, updatedWeapons } = handleRepeatedFire(currentPlayer, space, lastFired, [...gameState.deployedWeapons], handleGameEvent);

  let deployedWeapons = handleAiWeapons(updatedWeapons, motherships, updatedPlayers, aiShips);
  let gameData = {
    userId,
    players: updatedPlayers,
    weapons: removeOutOfBoundsShots(deployedWeapons),
    aiShips: updateAiShips(aiShips, userId, handleGameEvent, clockDifference, updatedPlayers, motherships, connected),
    animations: [...gameState.animations],
    motherships: [...motherships],
  }

  gameData = handleWeapons(gameData, handleGameEvent);
  const updatedMotherships = updateMotherships(gameData.motherships, userId, handleGameEvent, connected);

  return {
    players: gameData.players,
    aiShips: gameData.aiShips,
    deployedWeapons: gameData.weapons,
    gameBuff: updateGameBuff(gameBuff),
    animations: handleAnimations(gameData.animations),
    motherships: updatedMotherships,
    lastFired: newLastFired
  };
};

const updateMotherships = (motherships, userId, handleGameEvent, connected) => {
  return motherships.map((ship) => {
    if (ship.active) {
      updateFrame(ship.animation);
      handleHitpoints(ship, userId, handleGameEvent, connected);
      handleEffects(ship);
      handleItems(ship);
      return ship;
    } else {
      ship.explodeAnimation = updateAnimation(ship.explodeAnimation);
      return ship;
    }
  });
}

const handleAiWeapons = (weapons, motherships, players, aiShips) => {
  aiShips.forEach((ship) => {
    const { active, type, shouldFire, lastFired, weaponIndex } = ship;
    if (active && type === 'bomber' && shouldFire && canFire(lastFired, WEAPONS[weaponIndex].cooldown * 2, ship)) {
      const weapon = { ...WEAPONS[ship.weaponIndex] }
      weapons.push(handleFireWeapon(ship, weapon, 0, weapon.damage));
      ship.lastFired = Date.now();
      playSound(WEAPONS[ship.weaponIndex].sound);
    }
  });
  return handleMotherShipWeapons(weapons, motherships, players, aiShips);
};

const handleMotherShipWeapons = (weapons, motherships, players, aiShips) => {
  const minRange = 300
  motherships.forEach(mothership => {
    const target = nearestTarget(mothership.shipCenter, mothership.team, players.concat(aiShips), minRange);
    if (target) {
      const weapon = { ...WEAPONS[3] };
      const trajectory = angleFromCoordinates(mothership.location, target.location);
      weapons.push(mothershipWeapon(mothership, trajectory, mothership.team, weapon));
      zapSound.play();
    }
  });

  return weapons;
}

const handleAnimations = (animations) => {
  const updatedAnimations = []
  animations.forEach((animation) => {
    animation = updateAnimation(animation);
    if (!animation.complete) {
      updatedAnimations.push(animation);
    }
  });
  return updatedAnimations;
}

const updateAiShips = (aiShips, userId, handleGameEvent, clockDifference, players, motherships, connected) => {
  const updatedAiShips = [];
  aiShips.forEach((ship) => {
    if (!ship.explodeAnimation.complete) {
      if (ship.active) {
        ship = handleHitpoints(ship, userId, handleGameEvent, connected)
        handleWall(ship);
        handleEffects(ship)
      } else {
        ship.explodeAnimation = updateAnimation(ship.explodeAnimation);
      }

      if (ship.type === 'supplyShip') {
        ship.rotate = 'left';
      } else {
        const minRange = 1500
        const target = nearestTarget(ship.location, ship.team, players.concat(aiShips, motherships), minRange);

        if (target) {
          ship.rotate = handleAiDirection(ship.location, ship.angle, target);
          ship.shouldFire = true;
        } else {
          ship.rotate = 'none';
          ship.shouldFire = false;
        }
      }
      updatePlayer(ship, ANAIMATION_FRAME_RATE, clockDifference);
      updatedAiShips.push(ship);
    }
  });

  return updatedAiShips;
}

const nearestTarget = (location, team, players, minRange) => {
  const opponentColor = team === 'red' ? 'blue' : 'red';
  let target = null;

  players.forEach((player) => {
    const distance = Math.abs(location.x - player.location.x) + Math.abs(location.y - player.location.y);

    if (distance < minRange && player.team === opponentColor && player?.active && !isInvisable(player.effects)) {
      minRange = distance;
      target = player;
    }
  });

  return target;
}

export const isInvisable = (effects) => {
  return effects[5];
}

const handleAiDirection = (location, angle, target) => {
  const targetAngle = Math.atan2(location.y - target.location.y, location.x - target.location.x) * 180 / Math.PI + 180;

  if (Math.abs(targetAngle - angle) > 2) {
    if (targetAngle > angle) {
      return targetAngle - angle < 180 ? 'right' : 'left'
    } else {
      return angle - targetAngle < 180 ? 'left' : 'right'
    }
  }
}

const updatePlayers = (gameState, handleGameEvent, connected) => {
  const { players, clockDifference, userId } = gameState;

  return players.map((player) => {
    if (player.active) {
      player = handleHitpoints(player, userId, handleGameEvent, connected);
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);

      handleWall(player);
      handleEffects(player);
    } else if (!player.explodeAnimation.complete) {
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);
      player.explodeAnimation = updateAnimation(player.explodeAnimation);
    }

    return player
  });
}

const handleRepeatedFire = (player, space, lastFired, deployedWeapons, handleGameEvent) => {
  if (player && player.active) {
    if (space && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown, player)) {
      player.gameEvent = 'fire';
      handleGameEvent(player)
      const damage = handlePlayerDamage(player);
      const weapon = { ...WEAPONS[player.weaponIndex] };
      const updatedWeapons = [
        ...deployedWeapons,
        handleFireWeapon(player, weapon, 0, damage)
      ];

      playSound(WEAPONS[player.weaponIndex].sound);
      return { newLastFired: Date.now(), updatedWeapons };
    }
  }

  return { newLastFired: lastFired, updatedWeapons: deployedWeapons };
}

export const handlePlayerDamage = (player) => {
  let damage = WEAPONS[player.weaponIndex].damage + player.damage;

  if (player.effects[11]) {
    damage += round(damage * 0.25);
  } else if (player.effects[3]) {
    damage = round(damage / 2);
  }
  if (player.items[7]) {
    damage += round(damage * 0.8);
  }
  return damage;
}

const hasNoKilledBy = (killedBy) => [undefined, null].includes(killedBy)

const handleHitpoints = (player, userId, handleGameEvent, connected) => {
  if (player.hitpoints <= 0 && player.active && player.gameEvent !== 'explode') {
    if (connected) {
      if (hasNoKilledBy(player.killedBy)) {
        // killed by ai player
        if (player.type === 'supplyShip') {
          player = explodePlayer(player, player);
        } else if (player.gameEvent !== 'waiting') {
          player.gameEvent = 'explode';
          handleGameEvent(player);
        }
      } else if (player.killedBy === userId) {
        player.gameEvent = 'explode';
        handleGameEvent(player);
      } else if (Date.now() - player.updatedAt > 1000) {
        player = explodePlayer(player, player);
      }
    } else if (player.userId === userId) {
      // if user lost connection to server... blow away everything and show modal with reconnect attempt (start attempt)
      player = explodePlayer(player, player);
    }
  }
  return player;
};

export const canFire = (lastFired, cooldown, player) => {
  if (player.effects[4]) {
    return false;
  } else {
    const rapidFireEffect = player.effects[10] ;
    const crippleEffect = player.effects[15];
    let updatedCooldown = rapidFireEffect ? (cooldown / 2) : cooldown
    updatedCooldown = crippleEffect ? (updatedCooldown * 2) : updatedCooldown;
    return Date.now() - lastFired > updatedCooldown;
  }
}

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;

  if (player.accelerate) {
    currentVelocity += player.velocity;

    if (player.effects[9]) {
      currentVelocity += 4;
    }
    if (player.items[11]) {
      currentVelocity += 3;
    }
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = ((player.velocity) * 1000) - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  };
  if (player.effects[2] || player.effects[15]) {
    currentVelocity /= 2;
  }

  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return round(currentVelocity * gameTime);
}

export const updatePlayer = (player, elapsedTime, clockDifference) => {
  if (!player.effects[4]) {
    player.angle = handleAngle(player.rotate, player.angle, elapsedTime);
    const distance = distanceTraveled(player, elapsedTime, clockDifference);
    const trajectory = player.accelerate ? player.angle : player.trajectory;
    player.location = handleLocation(trajectory, player.location, distance);
  }

  if (player.type === 'human') {
    handleItems(player);
  }

  if (player.thrusterAnimation) {
    updateFrame(player.thrusterAnimation);
  }
  return player
}

const handleNuclearWeapon = (gameData, weapon, attacker) => {
  const { players, aiShips, motherships } = gameData;
  const nuclearRange = 700;
  players.concat(aiShips, motherships).forEach((player) => {
    if (player.team !== weapon.team) {
      const distance = Math.abs(weapon.location.x - player.location.x) + Math.abs(weapon.location.y - player.location.y);
      if (distance < nuclearRange) {
        applyHit(player, weapon, attacker, gameData.animations)
      }
    }
  });

  playSound(explosionSound);
  const nuclearBlastAnimation = { ...EXPLOSION_ANIMATIONS[1], location: weapon.location, coordinates: { x: 0, y: 0 } }
  gameData.animations.push(nuclearBlastAnimation);
  return gameData;
};

const handleAreaOfEffect = (gameData, weapon, attacker) => {
  const { players, aiShips, motherships } = gameData;
  const areaRange = 400;

  players.concat(aiShips, motherships).forEach((player) => {
    if (player.team !== weapon.team) {
      const distance = Math.abs(weapon.location.x - player.location.x) + Math.abs(weapon.location.y - player.location.y);
      if (distance < areaRange && !player.effects[6]) {
        const effect = createEffect(weapon.effectIndex, attacker.level * 3000, player.effects[weapon.id]);
        player.effects[effect.id] = effect;
      }
    }
  });

  playSound(weapon.sound);
  const gameAnimation = { ...GAME_ANIMATIONS[weapon.animationIndex], location: weapon.location, coordinates: { x: 0, y: 0 } }
  gameData.animations.push(gameAnimation);
  return gameData;
}

const weaponFromPlayer = (gameData, weapon, newWeapons, allShips) => {
  const { players, userId, animations } = gameData;
  const attacker = players.find((attacker) => attacker.userId === weapon.playerIndex);
  const player = players.find((player) => player.userId === userId);

  if (attacker?.effects[14] || weapon.id === 8) {
    const minRange = 3000;
    const target = nearestTarget(weapon.location, player.team, allShips, minRange);
    const direction = target ? handleAiDirection(weapon.location, weapon.trajectory, target) : 0;
    weapon.trajectory = handleAngle(direction, weapon.trajectory, ANAIMATION_FRAME_RATE);
  }

  weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
  
  handleCollision(allShips, weapon, attacker, animations);

  if (weapon.id) {
    handleAbilityWeapons(gameData, weapon, attacker);
  }

  if (weapon.animation) {
    updateFrame(weapon.animation);
  }

  if (!weapon.removed) {
    newWeapons.push(weapon);
  }

  if (attacker.levelUp) {
    delete attacker.levelUp
    attacker.level += 1;
    attacker.gold += 50;
    playSound(upgradeSound);
    gameData.animations.push({ ...GAME_ANIMATIONS[0], location: attacker.location, coordinates: { x: 0, y: 0 } });
  }

  gameData.weapons = newWeapons;
  return gameData;
}

export const handleWeapons = (gameData) => {
  let newWeapons = [];
  const { players, aiShips, motherships } = gameData;
  const allShips = players.concat(aiShips, motherships);

  gameData.weapons.forEach((weapon) => {
    if (weapon.from === 'human') {
      gameData = weaponFromPlayer(gameData, weapon, newWeapons, allShips);
    } else {
      gameData = weaponFromAi(gameData, weapon, newWeapons, allShips);
    }
  });

  return gameData;
};

export const findCenterCoordinates = (location, center, offset) => {
  const x = location.x + center.x - (offset.width / 2);
  const y = location.y + center.y - (offset.height / 2);
  return { x, y }
}

const handleAbilityWeapons = (gameData, weapon, attacker) => {
  if (weapon.id === 1) {
    if (Date.now() - weapon.deployedAt > 2000) {
      gameData = handleNuclearWeapon(gameData, weapon, attacker);
      weapon.removed = true
    }
  } else if (weapon.id === 6) {
    if (Date.now() - weapon.deployedAt > 6000) {
      weapon.removed = true
    } else {
      const shipCenter = SHIPS[attacker.shipIndex].shipCenter;
      weapon.location = findCenterCoordinates(attacker.location, shipCenter, weapon);
    }
  } else if (weapon.id === 3 && weapon.removed) {
    const mineExplosionAnimation = { ...EXPLOSION_ANIMATIONS[0], location: weapon.location, coordinates: { x: 0, y: 0 } }
    gameData.animations.push(mineExplosionAnimation);
  } else if (weapon.id === 7 && weapon.removed) {
    const meteorExplosion = { ...EXPLOSION_ANIMATIONS[3], location: weapon.location, coordinates: { x: 0, y: 0 } }
    gameData.animations.push(meteorExplosion);
  } else if ([9, 10].includes(weapon.id)) {
    if (Date.now() - weapon.deployedAt > 1500) {
      gameData = handleAreaOfEffect(gameData, weapon, attacker);
      weapon.removed = true
    }
  }

  return gameData;
};

const weaponFromAi = (gameData, weapon, newWeapons, allShips) => {
  weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
  handleCollision(allShips, weapon, {}, gameData.animations)

  if (!weapon.removed) {
    newWeapons.push(weapon);
  }
  gameData.weapons = newWeapons;
  return gameData;
};

const removeOutOfBoundsShots = (weapons) => {
  return weapons.filter((weapon) => {
    return weapon.location.x > -50 &&
      weapon.location.x < BOARD_WIDTH + 50 &&
      weapon.location.y > -50 &&
      weapon.location.y < BOARD_HEIGHT + 50
  });
};

export const findStartCenter = (player) => {
  let startCenter = { x: 60, y: 30 };
  if (player.type === 'bomber') {
    startCenter = ['redMothership', 'blueMothership'].includes(player.name) ? MOTHER_SHIP.shipCenter : BOMBERS[player.index].shipCenter;
  } else if (player.type === 'human') {
    startCenter = SHIPS[player.shipIndex].shipCenter;
  }

  return startCenter;
}

const findShipBoundingBoxes = (player) => {
  const startCenter = findStartCenter(player);
  const shipCenter = { x: player.location.x + startCenter.x, y: player.location.y + startCenter.y }

  return [
    handleLocation(player.angle, { x: shipCenter.x, y: shipCenter.y }, 30),
    handleLocation(player.angle, { x: shipCenter.x, y: shipCenter.y }, 10),
    handleLocation(player.angle, { x: shipCenter.x, y: shipCenter.y }, -10),
    handleLocation(player.angle, { x: shipCenter.x, y: shipCenter.y }, -35)
  ];
}

const handleCollision = (players, weapon, attacker, animations) => {
  players.forEach((player) => {
    if (player.team !== weapon.team && player.active) {
      const shipBoundingBoxes = findShipBoundingBoxes(player);
      const weaponCenter = { x: weapon.location.x + (weapon.width / 2), y: weapon.location.y + (weapon.height / 2) }

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);

        if ((index < 3 && distance < (18 + weapon.damageRadius)) || (index > 2 && distance < 23 + weapon.damageRadius)) {
          applyHit(player, weapon, attacker, animations);
        }
      });
    };
  });
};

const applyHit = (player, weapon, attacker, animations) => {
  if (weapon.id === 3) {
    playSound(mineTriggerSound);
  }

  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    if (!weapon.id) {
      animations.push({ ...GAME_ANIMATIONS[4], location: weapon.location, yOffset: -32, coordinates: { x: 0, y: 0 } });
    }
    updateCollisionData(player, weapon, attacker);
  }
  if (![5, 6].includes(weapon.id)) {
    weapon.removed = true;
  }
};

const updateCollisionData = (player, weapon, attacker) => {
  if (player.hitpoints > 0) {
    player = handleNegativeBuff(player, weapon);
    const damage = calculateDamage(weapon, player);

    player.hitpoints -= damage;
    if (getItem(player.items, 10)) {
      const newHitpoints = attacker.hitpoints - round(damage * 0.3)
      attacker.hitpoints = newHitpoints > 0 ? newHitpoints : 1;
    }
    if (attacker.type === 'human') {
      attacker = handlePositiveBuff(attacker, weapon);
      attacker.score += round(damage * 0.1)

      if (player.hitpoints <= 0) {
        const bounty = round(player.maxHitpoints * 0.1);
        player.killedBy = weapon.playerIndex
        attacker.kills += 1
        attacker.gold += bounty;
        attacker.score += bounty;

      };
      if (didLevelUp(attacker.level, attacker.score) && attacker.level < 10) {
        attacker.levelUp = true;
      }
    }
  }
};

const didLevelUp = (level, score) => {
  if (score > 500) {
    return round(score / 500) > level;
  }
};

const handleNegativeBuff = (player, weapon) => {
  if (weapon.index === 5 || weapon.id === 8) {
    const effect = createEffect(0, 3000, player.effects[1]);
    player.effects[effect.id] = effect;
  } else if (weapon.index === 6 || (weapon.id === 6 && !player.effects[2])) {
    const effect = createEffect(1, 2000, player.effects[2]);
    player.effects[effect.id] = effect;
  } else if (weapon.id === 7) {
    const slow = createEffect(1, 9000, player.effects[2]);
    player.effects[slow.id] = slow;

    const poison = createEffect(0, 9000, player.effects[1]);
    player.effects[poison.id] = poison;
  }

  if ((weapon.canStun && Math.random() <= 0.1) || weapon.id === 2) {
    const effect = createEffect(3, 3000, player.effects[4]);
    player.effects[effect.id] = effect;
  };
  return player;
}

const handlePositiveBuff = (player, weapon) => {
  if (weapon.index === 3) {
    let newHitpoints = player.hitpoints + round(weapon.damage / 15);
    if (newHitpoints > player.maxHitpoints) {
      newHitpoints = player.maxHitpoints;
    }
    player.hitpoints = newHitpoints;
  }
  return player
}

const calculateDamage = (weapon, player) => {
  let armor = player.armor;

  if (player.effects[8]) {
    armor += 4;
  } else if (weapon.index === 7) {
    armor = 0;
  } else if (player.effects[12]) {
    armor -= 3;
  }
  let damage = weapon.damage;

  if (weapon.index === 4 && Math.random() >= 0.8) {
    damage *= 2
  }

  if (getItem(player.items, 9) && Math.random() > 0.75) {
    // play miss sound
    damage = 0;
  }

  return round(damage * (10 - armor) / 10);
}

const mothershipWeapon = (mothership, trajectory, team, weapon) => {
  weapon.from = 'mothership';
  weapon.trajectory = trajectory;
  weapon.team = team;
  weapon.playerIndex = `mothership${team}`;
  weapon.location = mothership.shipCenter;
  return weapon;
};

export const handleFireWeapon = (player, weapon, elapsedTime, damage) => {
  const angle = handleAngle(player.rotate, player.angle, elapsedTime);
  const location = player.location;
  const shipCenter = player.type === 'human' ? SHIPS[player.shipIndex].shipCenter : BOMBERS[player.index].shipCenter;
  const coordinates = findCenterCoordinates(location, shipCenter, weapon);

  weapon.location = handleLocation(angle, coordinates, 50);
  weapon.trajectory = angle;
  weapon.playerIndex = player.userId;
  weapon.team = player.team;
  weapon.damage = damage;
  weapon.canStun = player.items[6];
  weapon.invisible = weapon.id === 3;
  weapon.from = player.type;

  return weapon;
};

const findHypotenuse = (point, pointTwo) => {
  return round(Math.sqrt((point.x - pointTwo.x) ** 2 + (point.y - pointTwo.y) ** 2))
};

export const handleLocation = (trajectory, location, distance) => {
  const radians = trajectory * Math.PI / 180
  const x = round(location.x + Math.cos(radians) * distance)
  const y = round(location.y + Math.sin(radians) * distance)
  return { x, y }
}

export const handleAngle = (direction, angle, elapsedTime) => {
  switch (direction) {
    case 'left':
      angle = (angle - 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360;
      return angle < 0 ? 360 + angle : angle;
    case 'right':
      return (angle + 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360
    default:
      return angle;
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
