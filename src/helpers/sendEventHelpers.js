import { WEAPONS } from '../constants/weapons.js';
import { SHIPS, BOMBERS } from '../constants/ships.js';
import { ABILITIES } from '../constants/abilities.js';
import { canFire, updatePlayer, handleFireWeapon, handlePlayerDamage } from '../helpers/gameLogic.js';
import { playSound, stopSound } from '../helpers/audioHelpers.js';
import { thruster, mineDropSound, backupSound } from '../constants/settings.js';
import faker from 'faker';
import { round } from './mathHelpers.js';

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
      updatedPlayer.lastAccelerationTime = Date.now() + clockDifference;
      updatedPlayer.accelerate = false;
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
};

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
  if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown, currentPlayer)) {
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
      return updatePlayer(updatedPlayer, 0);
    } else {
      return player
    }
  });

  updateState({ players: newPlayersState })
  if (soundEffect) {
    soundEffect();
  }
};

export const queueForWeaponUpdate = (player, updateState, handleGameEvent, soundEffect, updatedWeapons) => {
  handleGameEvent(player);
  updateState({ deployedWeapons: updatedWeapons })
  if (soundEffect) {
    soundEffect();
  }
};

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
    effects: {},
    active: true,
  };
};

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
};

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
};

export const handleAbilityEvent = (player, abilityData, handleGameEvent, updateState, pressedKey) => {
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
      payload = { gameEvent: 'bombers', override: true, team: player.team, bombers: backupShips };
    };
    handleGameEvent(payload);
    abilityData[pressedKey].lastUsed = Date.now();
    updateState({ abilityData });
  }
};

const isCallForBackup = (player, pressedKey) => player.shipIndex === 6 && pressedKey === 'q';

const canUseAbility = (ability, player, pressedKey) => {
  return Date.now() - ability.lastUsed > ABILITIES[SHIPS[player.shipIndex].abilities[pressedKey]].cooldown
};

const createBackupShips = (abilityLevel, team) => {
  let i = 0
  const backupShips = [];
  while (i < abilityLevel) {
    backupShips.push(createBomber(i + 1, team));
    i += 1;
  }
  return backupShips;
};

export const createBombers = (wave, players) => {
  let bombers = [];

  const waveValue = wave > 29 && players.length > 1 ? 30 : wave;
  const teamCounts = { red: 0, blue: 0 };
  players.forEach(p => { teamCounts[p.team] += 1 });

  Object.keys(teamCounts).forEach(team => { bombers = bombers.concat(bombersByWave(waveValue, team)) });

  const diff = teamCounts.red - teamCounts.blue;

  if (diff < 0) {
    bombers = bombers.concat(bombersByWave(round(waveValue / 2), 'red'));
  } else if (diff > 0) {
    bombers = bombers.concat(bombersByWave(round(waveValue / 2), 'blue'));
  }

  return bombers;
};

const bombersByWave = (wave, team) => {
  const bombers = [];
  let i = wave / 2;
  let bomberIndex = 0;

  while (i > 0) {
    if (i > 8) {
      bomberIndex = 3;
      i -= 8
    } else if (i > 5) {
      bomberIndex = 2;
      i -= 5
    } else if (i > 4) {
      bomberIndex = 1;
      i -= 4
    } else {
      bomberIndex = 0;
      i -= 1
    };

    bombers.push(createBomber(bomberIndex, team));
  };

  return bombers;
};

export const createBomber = (index, team) => {
  const x = team === 'red' ? 100 : BOARD_WIDTH - 100;
  const y = round(Math.random() * (BOARD_HEIGHT - 100) + 100)
  const location = { x, y }

  return {
    ...BOMBERS[index],
    team,
    name: faker.name.findName(),
    image: null,
    blueImage: null,
    lastFired: Date.now(),
    angle: team === 'red' ? 0 : 180,
    trajectory: team === 'red' ? 0 : 180,
    location,
    shouldFire: false
  }
};
