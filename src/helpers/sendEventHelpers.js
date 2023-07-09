import { WEAPONS } from '../constants/weapons.js';
import { SHIPS, BOMBERS } from '../constants/ships.js';
import { ABILITIES } from '../constants/abilities.js';
import { canFire, updatePlayer, handleFireWeapon, handlePlayerDamage } from '../helpers/gameLogic.js';
import { playSound, stopSound } from '../helpers/audioHelpers.js';
import { thruster, mineDropSound, backupSound } from '../constants/settings.js';
import faker from 'faker';

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../constants/settings.js';

export const keyDownEvent = (pressedKey, gameState, handleGameEvent, updateState, currentPlayer) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(gameState, handleGameEvent, updateState, currentPlayer);
      break;
    case 'left':
    case 'right':
      handleRotateEvent(gameState, pressedKey, handleGameEvent, updateState, currentPlayer);
      break;
    case 'up':
      handleAccelerateEvent(gameState, pressedKey, handleGameEvent, updateState, currentPlayer);
      break;
    case 'q':
    case 'w':
    case 'e':
      handleAbilityEvent(currentPlayer, { ...gameState.abilityData }, handleGameEvent, updateState, pressedKey);
      break;
    default:
      break;
  }
};

export const keyUpEventPayload = (
  pressedKey,
  gameState,
  handleGameEvent,
  updateState,
  currentPlayer
) => {
  const { players, up, left, right, clockDifference } = gameState;
  let updatedPlayer = handlePlayerOrientation({ ...currentPlayer }, up, left, right)
  let updatedPlayers = [...players]

  switch (pressedKey) {
    case 'left':
    case 'right':
      updatedPlayer.gameEvent = pressedKey + 'Stop'
      updatedPlayer.rotate = 'none';
      queueForPlayerUpdate(updatedPlayers, updatedPlayer, updateState, handleGameEvent);
      break;
    case 'up':
      updatedPlayer.gameEvent = 'upStop';
      updatedPlayer.trajectory = updatedPlayer.angle;
      updatedPlayer.lastAccelerationTime = Date.now() + clockDifference
      queueForPlayerUpdate(updatedPlayers, updatedPlayer, updateState, handleGameEvent, () => stopSound(thruster));
      break;
    case 'space':
      updatedPlayer.gameEvent = 'fireStop';
      queueForPlayerUpdate(updatedPlayers, updatedPlayer, updateState, handleGameEvent);
      break;
    default:
      break;
  }
};

const handlePlayerOrientation = (player, up, left, right) => {
  let rotate = 'none';
  if (left) {
    rotate = 'left';
  }
  if (right) {
    rotate = 'right';
  }

  return { ...player, rotate, accelerate: up }
}

const handleRotateEvent = (gameState, pressedKey, handleGameEvent, updateState, currentPlayer) => {
  const { players, up, left, right } = gameState;
  let updatedPlayers = [...players];
  let updatedPlayer = handlePlayerOrientation(currentPlayer, up, left, right)
  updatedPlayer = rotateEventPayload(updatedPlayer, pressedKey);
  queueForPlayerUpdate(updatedPlayers, updatedPlayer, updateState, handleGameEvent);
};

const handleAccelerateEvent = (gameState, pressedKey, handleGameEvent, updateState, currentPlayer) => {
  const { players, up, left, right } = gameState;
  let updatedPlayer = handlePlayerOrientation(currentPlayer, up, left, right);
  updatedPlayer = accelerateEventPayload(updatedPlayer, pressedKey)
  queueForPlayerUpdate([...players], updatedPlayer, updateState, handleGameEvent, () => playSound(thruster));
};

const handleSpaceBarEvent = (gameState, handleGameEvent, updateState, currentPlayer) => {
  const { lastFired, deployedWeapons } = gameState;
  if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown, false, false)) {
    let player = { ...currentPlayer, gameEvent: 'fire' }
    updateState({ lastFired: Date.now() });
    const damage = handlePlayerDamage(player);
    const updatedWeapons = [
      ...deployedWeapons,
      handleFireWeapon(player, { ...WEAPONS[player.weaponIndex] }, 0, damage)
    ];
    queueForWeaponUpdate(player, updateState, handleGameEvent, () => playSound(WEAPONS[player.weaponIndex].sound), updatedWeapons);
  };
};

const queueForPlayerUpdate = (updatedPlayers, updatedPlayer, updateState, handleGameEvent, soundEffect) => {
  handleGameEvent(updatedPlayer);

  const newPlayersState = updatedPlayers.map((player) => {
    if (player.userId === updatedPlayer.userId) {
      return updatePlayer(updatedPlayer, 0, 0);
    } else {
      return player
    }
  });

  updateState({ players: newPlayersState })
  if (soundEffect) {
    soundEffect();
  }
}

export const queueForWeaponUpdate = (player, updateState, handleGameEvent, soundEffect, updatedWeapons) => {
  handleGameEvent(player);
  updateState({ deployedWeapons: updatedWeapons })
  if (soundEffect) {
    soundEffect();
  }
}

export const startEventPayload = (player) => {
  const startData = getStartData(player.team);
  return {
    ...player,
    gameEvent: 'start',
    location: startData.location,
    angle: startData.angle,
    trajectory: startData.trajectory,
    hitpoints: player.maxHitpoints,
    team: player.team,
    active: true,
    effects: {},
  };
}

export const getStartData = (team) => {
  if (team === 'red') {
    return {
      location: { x: 100, y: 100 },
      angle: 1,
      trajectory: 0
    }
  } else {
    return {
      location: { x: BOARD_WIDTH - 100, y: BOARD_HEIGHT - 100 },
      angle: 181,
      trajectory: 180
    }
  }
}

const accelerateEventPayload = (player, pressedKey) => {
  return {
    ...player,
    gameEvent: pressedKey,
    accelerate: true,
    trajectory: player.angle,
  };
};

const rotateEventPayload = (player, pressedKey) => {
  return { ...player, gameEvent: pressedKey, rotate: pressedKey };
}

const handleAbilityEvent = (player, abilityData, handleGameEvent, updateState, pressedKey) => {
  const levelSum = abilityData.q.level + abilityData.w.level + abilityData.e.level;
  const ability = abilityData[pressedKey];

  if (player.level > levelSum && abilityData[pressedKey].level < 3) {
    playSound(mineDropSound);
    updateState({ abilityData: { ...abilityData, [pressedKey]: { ...ability, level: ability.level + 1 } } });
  } else if (canUseAbility(ability, player, pressedKey) && ability.level > 0) {
    let payload = { ...player, gameEvent: 'ability', usedAbility: pressedKey, abilityLevel: abilityData[pressedKey].level }
    if (isCallForBackup(player, pressedKey)) {
      playSound(backupSound);
      const backupShips = createBackupShips(abilityData[pressedKey].level, player.team);
      payload = { gameEvent: 'bombers', team: player.team, bombers: backupShips }
    }
    handleGameEvent(payload)
    abilityData[pressedKey].lastUsed = Date.now()
    updateState({ abilityData });
  }
}

const isCallForBackup = (player, pressedKey) => {
  return player.shipIndex === 6 && pressedKey === 'q';
}

const canUseAbility = (ability, player, pressedKey) => {
  return Date.now() - ability.lastUsed > ABILITIES[SHIPS[player.shipIndex].abilities[pressedKey]].cooldown
}

const createBackupShips = (abilityLevel, team) => {
  let i = 0
  const backupShips = [];
  while (i < abilityLevel) {
    backupShips.push(createBomber(i, i + 1, 300 * (i + 1), team));
    i += 1;
  }
  return backupShips;
}

const findShipCounts = (ships, opponentTeam) => {
  let allyCount = 0;
  let opponentCount = 0

  ships.forEach((ship) => {
    if (ship.type !== 'supplyShip') {
      if (ship.team === opponentTeam) {
        opponentCount += 1;
      } else {
        allyCount += 1;
      }
    }
  });

  return { allyCount, opponentCount }
}

export const createBombers = (wave, team, players) => {
  const { allyCount, opponentCount } = findShipCounts(players, team);
  const shipIndex = Math.floor(Math.random() * BOMBERS.length);

  const hitpoints = 100 + wave * 50;

  const weaponIndex = findWeaponIndex(wave);

  if (allyCount < opponentCount) {
    const bomberTeam = team === 'red' ? 'blue' : 'red';
    const count = opponentCount - allyCount
    return bombersByCount(bomberTeam, count, shipIndex, weaponIndex, hitpoints);
  } else if (opponentCount < allyCount) {
    const count = allyCount - opponentCount
    return bombersByCount(team, count, shipIndex, weaponIndex, hitpoints);
  }
}

const bombersByCount = (team, count, shipIndex, weaponIndex, hitpoints) => {
  const bombers = [];
  while (count > 0) {
    bombers.push(createBomber(shipIndex, weaponIndex, hitpoints, team));
    bombers.push(createBomber(shipIndex, weaponIndex, hitpoints, team));
    count -= 1
  }
  return bombers;
}

const findWeaponIndex = (wave) => {
  let index = Math.floor(Math.random() * WEAPONS.slice(0, 3).length);
  if (wave > 25) {
    index += 5
  } else if (wave > 20) {
    index += 3
  } else if (wave > 15) {
    index += 1
  }

  return index;
}

export const createBomber = (index, weaponIndex, hitpoints, team) => {
  return {
    ...BOMBERS[index],
    team,
    name: faker.name.findName(),
    image: null,
    blueImage: null,
    hitpoints,
    maxHitpoints: hitpoints,
    lastFired: Date.now(),
    angle: team === 'red' ? 0 : 180,
    weaponIndex,
    trajectory: team === 'red' ? 0 : 180,
  }
}
