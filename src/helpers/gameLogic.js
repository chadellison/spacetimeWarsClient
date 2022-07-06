import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  explosionSound,
  mineTriggerSound,
  zapSound
} from '../constants/settings.js';
import { SHIPS, BOMBERS, MOTHER_SHIP } from '../constants/ships.js';
import { WEAPONS, EXPLOSION_ANIMATIONS } from '../constants/weapons.js';
import { handleItems, handleAbsorbDamage, canAbsorbDamage, getItem } from '../helpers/itemHelpers';
import { handleEffects, updateGameBuff, createEffect } from '../helpers/effectHelpers';
import { updateAnimation } from '../helpers/animationHelpers';
import { round } from '../helpers/mathHelpers.js';
import { updateFrame } from '../helpers/animationHelpers.js';
import { playSound } from '../helpers/audioHelpers.js';
import { explodePlayer } from '../helpers/receiveEventHelpers.js';
import { upgradeSound, GAME_ANIMATIONS } from '../constants/settings.js';

export const updateGameState = (gameState, updateState, handleGameEvent) => {
  const {clockDifference, gameBuff, index, aiShips, space, lastFired, motherships} = gameState;
  let updatedPlayers = updatePlayers(gameState, handleGameEvent);
  const mothershipHpData = { red: motherships[0]?.hitpoints, blue: motherships[1]?.hitpoints }
  let deployedWeapons = handleRepeatedFire(updatedPlayers[index], space, lastFired, [...gameState.deployedWeapons], updateState, handleGameEvent);
  deployedWeapons = handleAiWeapons(deployedWeapons, aiShips);
  let gameData = {
    index,
    players: updatedPlayers,
    weapons: removeOutOfBoundsShots(deployedWeapons),
    aiShips: updateAiShips(aiShips, index, handleGameEvent, clockDifference, updatedPlayers, motherships),
    animations: [...gameState.animations],
    motherships: [...motherships]
  }
  gameData = handleWeapons(gameData, handleGameEvent);
  handleMothershipHitAnimations(gameData.animations, gameData.motherships, mothershipHpData)
  const updatedMotherships = updateMotherships(gameData.motherships, index, handleGameEvent);

  return {
    players: gameData.players,
    aiShips: gameData.aiShips,
    deployedWeapons: gameData.weapons,
    gameBuff: updateGameBuff(gameBuff),
    animations: handleAnimations(gameData.animations),
    motherships: updatedMotherships
  };
};

const handleMothershipHitAnimations = (gameAnimations, motherships, mothershipHpData) => {
  mothershipHpData.red !== motherships[0]?.hitpoints && gameAnimations.push({...GAME_ANIMATIONS[4], location: motherships[0]?.location, coordinates: {x: 0, y: 0}});
  mothershipHpData.blue !== motherships[1]?.hitpoints && gameAnimations.push({...GAME_ANIMATIONS[4], location: motherships[1]?.location, coordinates: {x: 0, y: 0}});
}

const updateMotherships = (motherships, index, handleGameEvent) => {
  return motherships.map((ship) => {
    updateFrame(ship.animation);
    handleHitpoints(ship, index, handleGameEvent);
    handleEffects(ship);
    handleItems(ship);
    return ship;
  });
}

const handleAiWeapons = (weapons, aiShips) => {
  aiShips.forEach((ship) => {
    if (ship.active && ship.type === 'bomber' && canFire(ship.lastFired, WEAPONS[ship.weaponIndex].cooldown * 2, false, ship.effects[15])) {
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

const updateAiShips = (aiShips, index, handleGameEvent, clockDifference, players, motherships) => {
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
      const target = nearestTarget(ship.location, ship.team, players.concat(aiShips, motherships));

      if (ship.type === 'supplyShip') {
        ship.rotate = 'left';
      } else if (target && !isInvisable(target.effects) && target.active) {
        ship.rotate = handleAiDirection(ship.location, ship.angle, target);
      } else {
        ship.rotate = 'none';
      }
      updatePlayer(ship, ANAIMATION_FRAME_RATE, clockDifference)
      updatedAiShips.push(ship);
    }
  });

  return updatedAiShips;
}

const nearestTarget = (location, team, players) => {
  const opponentColor = team === 'red' ? 'blue' : 'red';
  let min = 10000
  let target =  null;

  players.forEach((player) => {
    const distance = Math.abs(location.x - player.location.x);
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

const handleAiDirection = (location, angle, target) => {
  const targetAngle = Math.atan2(location.y - target.location.y, location.x - target.location.x) * 180 / Math.PI + 180;

  if (targetAngle > angle) {
    return targetAngle - angle < 180 ? 'right' : 'left'
  } else {
    return angle - targetAngle < 180 ? 'left' : 'right'
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
    if (space && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown, player.effects[10], player.effects[15])) {
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
    if (noKilledBy) {
      if (player.type === 'supplyShip') {
        player = explodePlayer(player, player);
      } else if (player.gameEvent !== 'waiting') {
        player.gameEvent = 'explode';
        handleGameEvent(player);
      }
    } else if (player.killedBy === index) {
      player.gameEvent = 'explode';
      handleGameEvent(player);
    } else if ((new Date()).getTime() - player.updatedAt > 1000) {
      player = explodePlayer(player, player);
    }
  }
  return player;
};

export const canFire = (lastFired, cooldown, rapidFireFirect, crippleEffect) => {
  let updatedCooldown = rapidFireFirect ? (cooldown / 2) : cooldown
  updatedCooldown = crippleEffect ? (updatedCooldown * 2) : updatedCooldown;
  return Date.now() - lastFired > updatedCooldown;
}

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = DRIFT;

  if (player.accelerate) {
    currentVelocity += player.velocity;
    if (player.effects[9]) {
      currentVelocity += 4
    }
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = ((player.velocity) * 1000) - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  }
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

const applyHitToAll = (players, weapon, attacker) => {
  players.forEach((player) => {
    if (player.team !== weapon.team) {
      applyHit(player, weapon, attacker)
    }
  });
}

const handleNuclearWeapon = (gameData, weapon, attacker) => {
  applyHitToAll(gameData.players, weapon, attacker);
  applyHitToAll(gameData.aiShips, weapon, attacker);
  applyHitToAll(gameData.motherships, weapon, attacker);

  playSound(explosionSound);
  const nuclearBlastAnimation = {...EXPLOSION_ANIMATIONS[1], location: weapon.location, coordinates: {x: 0, y: 0}}
  gameData.animations.push(nuclearBlastAnimation);
  return gameData;
}

const weaponFromPlayer = (gameData, weapon, newWeapons) => {
  const { players, index, aiShips, motherships } = gameData;
  const attacker = players[weapon.playerIndex];
  const player = players[index];

  if (attacker?.effects[14]) {
    const target = nearestTarget(weapon.location, player.team, players.concat(aiShips, motherships));
    const direction = handleAiDirection(weapon.location, weapon.trajectory, target);
    weapon.trajectory = handleAngle(direction, weapon.trajectory, ANAIMATION_FRAME_RATE);
  }
  weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);

  handleCollision(gameData.players, weapon, attacker);
  handleCollision(gameData.aiShips, weapon, attacker);
  handleCollision(gameData.motherships, weapon, attacker);

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
  handleCollision(gameData.motherships, weapon, {})

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
  let startCenter = {x: 60, y: 30};
  if (player.type === 'bomber') {
    startCenter = ['redMothership', 'blueMothership'].includes(player.name) ? MOTHER_SHIP.shipCenter : BOMBERS[player.index].shipCenter;
  } else if (player.type === 'human') {
    startCenter = SHIPS[player.shipIndex].shipCenter;
  }

  return startCenter;
}

const findShipBoundingBoxes = (player) => {
  const startCenter = findStartCenter(player);
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
    handleMothershipEffect(player);
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

const handleMothershipEffect = (player) => {
  if (player.type !== 'bomber' || !['redMothership', 'blueMothership'].includes(player.name)) {
    const shipCenter = findStartCenter(player);
    const centerCoordinates = findCenterCoordinates(player.location, shipCenter, { width: 0, height: 0 });

    if (centerCoordinates.x > BOARD_WIDTH - 250 && centerCoordinates.y > BOARD_HEIGHT - 159) {
      applyMothershipEffect(player, 'blue');
    } else if (centerCoordinates.x < 250 && centerCoordinates.y < 159) {
      applyMothershipEffect(player, 'red');
    }
  }
}

const applyMothershipEffect = (player, team) => {
  if (player.active) {
    if (player.team !== team) {
      applyMothershipZap(player);
    } else {
      const effect = createEffect(6, 1000, player.effects[7]);
      player.effects[effect.id] = effect;
    }
  }
}

const applyMothershipZap = (player) => {
  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    zapSound.play();
    const effect = createEffect(12, 1000, player.effects[13]);
    player.effects[effect.id] = effect;
  }
}

const applyHit = (player, weapon, attacker) => {
  if (weapon.id === 3) {
    playSound(mineTriggerSound);
  }

  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    updateCollisionData(player, weapon, attacker);
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
  const angle = handleAngle(player.rotate, player.angle, elapsedTime);
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
