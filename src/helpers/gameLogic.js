import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  explosionSound,
  mineTriggerSound
} from '../constants/settings.js';
import {SHIPS, BOMBERS} from '../constants/ships.js';
import {WEAPONS, EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {handleItems, handleAbsorbDamage, canAbsorbDamage, getItem} from '../helpers/itemHelpers';
import {handleEffects, updateGameBuff, createEffect} from '../helpers/effectHelpers';
import {updateAnimation} from '../helpers/animationHelpers';
import {round} from '../helpers/mathHelpers.js';
import {updateFrame} from '../helpers/animationHelpers.js';
import {playSound} from '../helpers/audioHelpers.js';
import {explodePlayer} from '../helpers/receiveEventHelpers.js';
import {upgradeSound, GAME_ANIMATIONS} from '../constants/settings.js';

export const updateGameState = (gameState, updateState, handleGameEvent) => {
  const {clockDifference, gameBuff, index, aiShips, space, lastFired} = gameState;
  let updatedPlayers = updatePlayers(gameState, handleGameEvent);
  let deployedWeapons = handleRepeatedFire(updatedPlayers[index], space, lastFired, [...gameState.deployedWeapons], updateState, handleGameEvent);
  deployedWeapons = handleAiWeapons(deployedWeapons, aiShips);
  let gameData = {
    players: updatedPlayers,
    weapons: removeOutOfBoundsShots(deployedWeapons),
    aiShips: updateAiShips(aiShips, index, handleGameEvent, clockDifference, updatedPlayers),
    animations: [...gameState.animations]
  }
  gameData = handleWeapons(gameData, handleGameEvent);
  return {
    players: gameData.players,
    aiShips: gameData.aiShips,
    deployedWeapons: gameData.weapons,
    gameBuff: updateGameBuff(gameBuff),
    animations: handleAnimations(gameData.animations),
  };
};

const handleAiWeapons = (weapons, aiShips) => {
  aiShips.forEach((ship) => {
    if (ship.active && ship.type === 'bomber' && canFire(ship.lastFired, WEAPONS[ship.weaponIndex].cooldown * 2, false)) {
      const weapon = { ...WEAPONS[ship.weaponIndex] }
      weapons.push(handleFireWeapon(ship, weapon, 0, weapon.damage));
      ship.lastFired = Date.now();
      playSound(WEAPONS[ship.weaponIndex].sound);
    }
  });
  return weapons;
};

const handleAnimations = (animations) => {
  let updatedAnimations = []
  animations.forEach((animation) => {
    animation = updateAnimation(animation);
    if (!animation.complete) {
      updatedAnimations.push(animation);
    }
  });
  return updatedAnimations;
}

const updateAiShips = (aiShips, index, handleGameEvent, clockDifference, players) => {
  let updatedAiShips = [];
  aiShips.forEach((ship) => {
    if (!ship.explodeAnimation.complete) {
        if (ship.active) {
          ship = handleHitpoints(ship, index, handleGameEvent)
          handleWall(ship);
          handleEffects(ship)
        } else {
          ship.explodeAnimation = updateAnimation(ship.explodeAnimation);
        }
        const target = nearestTarget(ship, players);

        if (ship.type === 'supplyShip') {
          ship.rotate = 'left';
        } else if (target && !isInvisable(target.effects) && target.active) {
          ship.rotate = handleAiDirection(ship, target);
        } else {
          ship.rotate = 'none';
        }
        updatePlayer(ship, ANAIMATION_FRAME_RATE, clockDifference)
        updatedAiShips.push(ship);
    }
  });

  return updatedAiShips;
}

const nearestTarget = (ship, players) => {
  const opponentColor = ship.team === 'red' ? 'blue' : 'red';
  let min = 10000
  let target =  null;

  players.forEach((player) => {
    const distance = Math.abs(ship.location.x - player.location.x);
    if (distance < min && player.team === opponentColor) {
      min = distance;
      target = player;
    }
  })
  return target;
}

export const isInvisable = (effects) => {
  return effects[5];
}

const handleAiDirection = (ship, target) => {
  const targetAngle = Math.atan2(ship.location.y - target.location.y, ship.location.x - target.location.x) * 180 / Math.PI + 180;

  if (targetAngle > ship.angle) {
    return targetAngle - ship.angle < 180 ? 'right' : 'left'
  } else {
    return ship.angle - targetAngle < 180 ? 'left' : 'right'
  }
}

const updatePlayers = (gameState, handleGameEvent) => {
  const {players, clockDifference, index} = gameState;
  return [...players].map((player) => {
    if (player.active) {
      player = handleHitpoints(player, index, handleGameEvent);
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

const handleRepeatedFire = (player, space, lastFired, deployedWeapons, updateState, handleGameEvent) => {
  if (player && player.active) {
    if (space && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown, player.effects[10])) {
      const updatedPlayer = {...player, gameEvent: 'fire'};
      handleGameEvent(updatedPlayer)
      const damage = handlePlayerDamage(updatedPlayer);
      const weapon = {...WEAPONS[player.weaponIndex]};
      const updatedWeapons = [
        ...deployedWeapons,
        handleFireWeapon(updatedPlayer, weapon, 0, damage)
      ];

      updateState({lastFired: Date.now()});
      playSound(WEAPONS[player.weaponIndex].sound);
      return updatedWeapons;
    }
  }
  return deployedWeapons;
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

const handleHitpoints = (player, index, handleGameEvent) => {
  if (player.hitpoints <= 0 && player.active && player.gameEvent !== 'explode') {
    const noKilledBy = [undefined, null].includes(player.killedBy);
    if ((player.type === 'bomber' && player.gameEvent !== 'waiting') || (noKilledBy && player.type === 'supplyShip')) {
      player = explodePlayer(player, player);
    } else if (player.killedBy === index || (noKilledBy && player.index === index)) {
      player.gameEvent = 'explode';
      handleGameEvent(player);
    }
  }
  return player;
};

export const canFire = (lastFired, cooldown, rapidFireFirect) => {
  const updatedCooldown = rapidFireFirect ? (cooldown / 2) : cooldown
  return Date.now() - lastFired > updatedCooldown;
}

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;
  let playerVelocity = player.effects[2] ? 1 : player.velocity;

  if (player.accelerate) {
    currentVelocity += playerVelocity;
    if (player.effects[9]) {
      currentVelocity += 4
    }
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = ((playerVelocity) * 1000) - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  }
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return round(currentVelocity * gameTime);
}

export const updatePlayer = (player, elapsedTime, clockDifference) => {
  if (!player.effects[4]) {
    player.angle = handleAngle(player, elapsedTime);
    const distance = distanceTraveled(player, elapsedTime, clockDifference);
    const trajectory = player.accelerate ? player.angle : player.trajectory;
    player.location = handleLocation(trajectory, player.location, distance);
  }
  if (player.type === 'human') {
    handleItems(player);
  }
  return player
}

const applyHitToAll = (players, weapon, attacker) => {
  players.forEach((player) => {
    if (player.team !== weapon.team) {
      applyHit(player, weapon, attacker)
    }
  });
}

const handleNuclearWeapon = (gameData, weapon, attacker) => {
  applyHitToAll(gameData.players, weapon, attacker)
  applyHitToAll(gameData.aiShips, weapon, attacker)

  playSound(explosionSound);
  const nuclearBlastAnimation = {...EXPLOSION_ANIMATIONS[1], location: weapon.location, coordinates: {x: 0, y: 0}}
  gameData.animations.push(nuclearBlastAnimation);
  return gameData;
}

const weaponFromPlayer = (gameData, weapon, newWeapons) => {
  let attacker = gameData.players[weapon.playerIndex];
  weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);

  handleCollision(gameData.players, weapon, attacker)
  handleCollision(gameData.aiShips, weapon, attacker)

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
    playSound(upgradeSound);
    gameData.animations.push({...GAME_ANIMATIONS[0], location: attacker.location, coordinates: {x: 0, y: 0}});
  }
  gameData.weapons = newWeapons;
  return gameData;
}

export const handleWeapons = (gameData) => {
  let newWeapons = [];
  gameData.weapons.forEach((weapon) => {
    if (weapon.from === 'human') {
      gameData = weaponFromPlayer(gameData, weapon, newWeapons);
    } else {
      gameData = weaponFromAi(gameData, weapon, newWeapons);
    }
  });

  return gameData;
};

export const findCenterCoordinates = (location, center, offset) => {
  const x = location.x + center.x - (offset.width / 2);
  const y = location.y + center.y - (offset.height / 2);
  return {x, y}
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
    const mineExplosionAnimation = {...EXPLOSION_ANIMATIONS[0], location: weapon.location, coordinates: {x: 0, y: 0}}
    gameData.animations.push(mineExplosionAnimation);
  } else if (weapon.id === 7 && weapon.removed) {
    const meteorExplosion = {...EXPLOSION_ANIMATIONS[3], location: weapon.location, coordinates: {x: 0, y: 0}}
    gameData.animations.push(meteorExplosion);
  }

  return gameData;
}

const weaponFromAi = (gameData, weapon, newWeapons) => {
  weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
  handleCollision(gameData.players, weapon, {})
  handleCollision(gameData.aiShips, weapon, {})

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

const findShipBoundingBoxes = (player) => {
  let startCenter = {x: 60, y: 30};
  if (player.type === 'bomber') {
    startCenter = BOMBERS[player.index].shipCenter;
  } else if (player.type === 'human') {
    startCenter = SHIPS[player.shipIndex].shipCenter;
  }
  const shipCenter = {x: player.location.x + startCenter.x, y: player.location.y + startCenter.y}

  return [
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 30),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -35)
  ];
}

const handleCollision = (players, weapon, attacker) => {
  players.forEach((player) => {
    if (player.team !== weapon.team && player.active) {
      const shipBoundingBoxes = findShipBoundingBoxes(player);
      const weaponCenter = {x: weapon.location.x + (weapon.width / 2), y: weapon.location.y + (weapon.height / 2)}

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);

        if ((index < 3 && distance < (18 + weapon.damageRadius)) || (index > 2 && distance < 23 + weapon.damageRadius)) {
          applyHit(player, weapon, attacker);
        }
      });
    };
  });
}

const applyHit = (player, weapon, attacker) => {
  if (weapon.id === 3) {
    playSound(mineTriggerSound);
  }

  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    console.log('BLAM!');
    updateCollisionData(player, weapon, attacker)
  }
  if (![5, 6].includes(weapon.id)) {
    weapon.removed = true
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
        const bounty = round(player.score * 0.01 + 50);
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
  if (weapon.index === 5) {
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

export const handleFireWeapon = (player, weapon, elapsedTime, damage) => {
  const angle = handleAngle(player, elapsedTime);
  const location = player.location;
  const shipCenter = player.type === 'human' ? SHIPS[player.shipIndex].shipCenter : BOMBERS[player.index].shipCenter;
  const coordinates = findCenterCoordinates(location, shipCenter, weapon);

  weapon.location = handleLocation(angle, coordinates, 50);
  weapon.trajectory = angle;
  weapon.playerIndex = player.index;
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
  return {x, y}
}

export const handleAngle = (player, elapsedTime) => {
  switch (player.rotate) {
    case 'left':
      const angle = (player.angle - 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360;
      return angle < 0 ? 360 + angle : angle;
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
