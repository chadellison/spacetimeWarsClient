import {
  ANAIMATION_FRAME_RATE,
  DRIFT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  explosionSound,
  mineTriggerSound
} from '../constants/settings.js';
import {SHIPS} from '../constants/ships.js';
import {WEAPONS, EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {handleItems, handleAbsorbDamage, canAbsorbDamage} from '../helpers/itemHelpers';
import {handleEffects, updateGameBuff} from '../helpers/effectHelpers';
import {updateAnimation} from '../helpers/animationHelpers';
import {round} from '../helpers/mathHelpers.js';
import {updateFrame} from '../helpers/animationHelpers.js';
import {playSound} from '../helpers/audioHelpers.js';
import {goldAudio} from '../constants/settings.js';

export const updateGameState = (gameState, updateState, handleGameEvent) => {
  const {clockDifference, gameBuff, index, aiShips, space, lastFired} = gameState;
  let updatedPlayers = updatePlayers(gameState, handleGameEvent, updateState);
  let deployedWeapons = handleRepeatedFire(updatedPlayers[index], index, space, lastFired, [...gameState.deployedWeapons], updateState, handleGameEvent);

  let gameData = {
    players: updatedPlayers,
    weapons: removeOutOfBoundsShots(deployedWeapons),
    aiShips: updateAiShips(aiShips, index, handleGameEvent, clockDifference),
    animations: [...gameState.animations],
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

const updateAiShips = (aiShips, index, handleGameEvent, clockDifference) => {
  let updatedAiShips = [];
  [...aiShips].forEach((ship) => {
    if (!ship.explodeAnimation.complete) {
      if (isLeak(ship) && [0, 1].includes(index)) {
        const opponentTeam = ship.team === 'red' ? 'blue' : 'red'
        handleGameEvent({id: ship.id, team: opponentTeam, gameEvent: 'leak'});
      } else {
        if (!ship.active) {
          ship.explodeAnimation = updateAnimation(ship.explodeAnimation);
        } else {
          ship = handleHitpoints(ship, index, handleGameEvent)
          handleWall(ship);
          handleEffects(ship)
        }
        updatePlayer(ship, ANAIMATION_FRAME_RATE, clockDifference)
        updatedAiShips.push(ship);
      }
    }
  });

  return updatedAiShips;
}

const updatePlayers = (gameState, handleGameEvent, updateState) => {
  const {players, clockDifference, index} = gameState;
  const updatedPlayers = [...players].map((player) => {
    if (player.active) {
      player = handleHitpoints(player, index, handleGameEvent);
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);

      handleWall(player);
      handleEffects(player)
    } else if (!player.explodeAnimation.complete) {
      player = updatePlayer(player, ANAIMATION_FRAME_RATE, clockDifference);
      player.explodeAnimation = updateAnimation(player.explodeAnimation);
    }
    return player
  });

  return updatedPlayers;
}

const handleRepeatedFire = (player, index, space, lastFired, deployedWeapons, updateState, handleGameEvent) => {
  if (player && player.active) {
    if (space && canFire(lastFired, WEAPONS[player.weaponIndex].cooldown, player.effects[10])) {
      const updatedPlayer = {...player, gameEvent: 'fire'};
      handleGameEvent(updatedPlayer)
      const damage = handlePlayerDamage(updatedPlayer)
      const updatedWeapons = [
        ...deployedWeapons,
        handleFireWeapon(updatedPlayer, {...WEAPONS[player.weaponIndex]}, 0, damage)
      ];
      updateState({lastFired: Date.now()});
      playSound(WEAPONS[player.weaponIndex].sound);
      return updatedWeapons;
    }
  }
  return deployedWeapons;
}

const handlePlayerDamage = (player) => {
  if (player.effects[11]) {
    return round(player.damage * 0.25);
  } else if (player.effects[13]) {
    return round(player.damage / 2);
  } else {
    return player.damage;
  }
}

const isLeak = (ship) => {
  return ship.type === 'bomber' && ship.active && ((ship.team === 'red' && ship.location.x > BOARD_WIDTH) || (ship.team === 'blue' && ship.location.x < 0));
}

const handleHitpoints = (player, index, handleGameEvent) => {
  if (player.hitpoints <= 0 && player.active && player.gameEvent !== 'explode') {
    if (player.killedBy === index) {
      player.gameEvent = 'explode';
      handleGameEvent(player);
    }
  }
  return player;
};

export const canFire = (lastFired, cooldown, rapidFireFirect) => {
  if (rapidFireFirect) {
    return Date.now() - lastFired > (cooldown / 2);
  } else {
    return Date.now() - lastFired > cooldown;
  }
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

const applyHitToAll = (players, weapon, attacker, handleGameEvent) => {
  players.forEach((player) => {
    if (player.team !== weapon.team) {
      applyHit(player, weapon, attacker, handleGameEvent)
    }
  });
}

export const handleWeapons = (gameData, handleGameEvent) => {
  let newWeapons = [];
  gameData.weapons.forEach((weapon) => {
    let attacker = gameData.players[weapon.playerIndex];
    weapon.location = handleLocation(weapon.trajectory, weapon.location, weapon.speed);
    if (weapon.id === 1) {
      if (Date.now() - weapon.deployedAt > 2000) {
        applyHitToAll(gameData.players, weapon, attacker, handleGameEvent)
        applyHitToAll(gameData.aiShips, weapon, attacker, handleGameEvent)

        playSound(explosionSound);
        const nuclearBlastAnimation = {...EXPLOSION_ANIMATIONS[1], location: weapon.location, coordinates: {...EXPLOSION_ANIMATIONS[1].coordinates}}
        gameData.animations.push(nuclearBlastAnimation);
        weapon.removed = true
      }
    } else {
      handleCollision(gameData.players, weapon, attacker, handleGameEvent)
      handleCollision(gameData.aiShips, weapon, attacker, handleGameEvent)
    }

    if (weapon.id === 6 && (Date.now() - weapon.deployedAt) > 6000) {
      weapon.removed = true
    }

    if (weapon.animation) {
      updateFrame(weapon.animation);
    }
    if (!weapon.removed) {
      newWeapons.push(weapon);
    } else if (weapon.id === 3) {
      const mineExplosionAnimation = {...EXPLOSION_ANIMATIONS[0], location: weapon.location, coordinates: {...EXPLOSION_ANIMATIONS[0].coordinates}}
      gameData.animations.push(mineExplosionAnimation);
    }
  });
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
  const startCenter = ['supplyShip', 'bomber'].includes(player.type) ? {x: 60, y: 30} : SHIPS[player.shipIndex].shipCenter;
  const shipCenter = {x: player.location.x + startCenter.x, y: player.location.y + startCenter.y}

  return [
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 30),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, 10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -10),
    handleLocation(player.angle, {x: shipCenter.x, y: shipCenter.y}, -35)
  ];
}

const handleCollision = (players, weapon, attacker, handleGameEvent) => {
  players.forEach((player) => {
    if (player.team !== weapon.team && player.active) {
      const shipBoundingBoxes = findShipBoundingBoxes(player);
      const weaponCenter = {x: weapon.location.x + (weapon.width / 2), y: weapon.location.y + (weapon.height / 2)}

      shipBoundingBoxes.forEach((center, index) => {
        const distance = findHypotenuse(center, weaponCenter);

        if ((index < 3 && distance < (18 + weapon.damageRadius)) || (index > 2 && distance < 23 + weapon.damageRadius)) {
          applyHit(player, weapon, attacker, handleGameEvent);
        }
      });
    };
  });
}

const applyHit = (player, weapon, attacker, handleGameEvent) => {
  if (weapon.id === 3) {
    playSound(mineTriggerSound);
  }

  if (canAbsorbDamage(player)) {
    handleAbsorbDamage(player);
  } else {
    console.log('BLAM!');
    updateCollisionData(player, weapon, attacker, handleGameEvent)
  }
  if (![5, 6].includes(weapon.id)) {
    weapon.removed = true
  }
};

const updateCollisionData = (player, weapon, attacker, handleGameEvent) => {
  if (player.hitpoints > 0) {
    player = handleNegativeBuff(player, weapon, attacker);
    const damage = calculateDamage(weapon, player);
    if (player.shipIndex === 3) {
      attacker.hitpoints -= round(damage / 4);
    }
    player.hitpoints -= damage;
    attacker = handlePositiveBuff(attacker, weapon);
  }
  if (player.hitpoints <= 0) {
    const bounty = round(player.score * 0.01 + 100);
    player.killedBy = weapon.playerIndex
    attacker.kills += 1
    attacker.gold += handleGold(bounty, attacker.shipIndex);
    attacker.score += bounty;
  };
};

const handleGold = (bounty, shipIndex) => {
  if (shipIndex === 2 && Math.random() > 0.8) {
    playSound(goldAudio);
    return bounty * 2;
  } else {
    return bounty;
  }
}

const handleNegativeBuff = (player, weapon) => {
  if (weapon.index === 5) {
    player.effects[GAME_EFFECTS[0].id] = {...GAME_EFFECTS[0], duration: 3000}
  } else if (weapon.index === 6 || weapon.id === 6) {
    player.effects[GAME_EFFECTS[1].id] = {...GAME_EFFECTS[1], duration: 2000}
  }

  if ((weapon.canStun && Math.random() <= 0.1) || weapon.id === 2) {
    player.effects[GAME_EFFECTS[3].id] = {...GAME_EFFECTS[3], duration: 3000}
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
  }
  let damage = weapon.damage;
  if (weapon.index === 4 && Math.random() >= 0.8) {
    damage *= 2
  }
  return round(damage * (10 - armor) / 10);
}

export const handleFireWeapon = (player, weapon, elapsedTime, damage) => {
  const angle = handleAngle(player, elapsedTime);
  const location = player.location;
  const shipCenter = SHIPS[player.shipIndex].shipCenter;
  const x = location.x + shipCenter.x - (weapon.width / 2);
  const y = location.y + shipCenter.y - (weapon.height / 2);

  weapon.location = handleLocation(angle, {x, y}, 50);
  weapon.trajectory = angle
  weapon.playerIndex = player.index
  weapon.team = player.team
  weapon.damage = damage
  weapon.canStun = player.items[6]
  weapon.invisible = player.effects[12] || weapon.id === 3 ? true : false

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
