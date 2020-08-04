import {WEAPONS} from '../constants/weapons.js';
import {SHIPS} from '../constants/ships.js';
import {ABILITIES} from '../constants/abilities.js';
import {canFire, updatePlayer, handleFireWeapon, handlePlayerDamage} from '../helpers/gameLogic.js';
import {playSound, stopSound} from '../helpers/audioHelpers.js';
import {thruster} from '../constants/settings.js';

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  EVENT_DIVIDER,
} from '../constants/settings.js';

export const keyDownEvent = (pressedKey, gameState, handleGameEvent, updateState) => {
  switch (pressedKey) {
    case 'space':
      handleSpaceBarEvent(gameState, handleGameEvent, updateState);
      break;
    case 'left':
    case 'right':
      handleRotateEvent(gameState, pressedKey, handleGameEvent, updateState);
      break;
    case 'up':
      handleAccelerateEvent(gameState, pressedKey, handleGameEvent, updateState);
      break;
    case 'q':
    case 'w':
    case 'e':
      handleAbility(gameState.players[gameState.index], {...gameState.abilityData}, handleGameEvent, updateState, pressedKey);
      break;
    default:
      break;
  }
};

export const keyUpEventPayload = (
  pressedKey,
  gameState,
  handleGameEvent,
  updateState
) => {
  const {players, index, up, left, right, clockDifference} = gameState;
  let updatedPlayer = handlePlayerOrientation({...players[index]}, up, left, right)
  let updatedPlayers = [...players]

  switch (pressedKey) {
    case 'left':
    case 'right':
      updatedPlayer.gameEvent = pressedKey + 'Stop'
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

  return {...player, rotate, accelerate: up}
}

const handleRotateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {players, index, up, left, right} = gameState;
  let updatedPlayers = [...players];
  let updatedPlayer = handlePlayerOrientation(updatedPlayers[index], up, left, right)
  updatedPlayer = rotateEventPayload(updatedPlayer, pressedKey);
  queueForPlayerUpdate(updatedPlayers, updatedPlayer, updateState, handleGameEvent);
};

const handleAccelerateEvent = (gameState, pressedKey, handleGameEvent, updateState) => {
  const {players, index, up, left, right} = gameState;
  let updatedPlayer = handlePlayerOrientation([...players][index], up, left, right)
  updatedPlayer = accelerateEventPayload(updatedPlayer, pressedKey)
  queueForPlayerUpdate([...players], updatedPlayer, updateState, handleGameEvent, () => playSound(thruster));
};

const handleSpaceBarEvent = (gameState, handleGameEvent, updateState) => {
  const {lastFired, players, deployedWeapons, index} = gameState;
  const currentPlayer = players[index]
  if (canFire(lastFired, WEAPONS[currentPlayer.weaponIndex].cooldown, currentPlayer.effects[10])) {
    let player = {...currentPlayer, gameEvent: 'fire'}
    updateState({lastFired: Date.now()});
    const damage = handlePlayerDamage(player);
    const updatedWeapons = [
      ...deployedWeapons,
      handleFireWeapon(player, {...WEAPONS[player.weaponIndex]}, 0, damage)
    ];
    queueForWeaponUpdate(player, updateState, handleGameEvent, () => playSound(WEAPONS[player.weaponIndex].sound), updatedWeapons);
  };
};

const queueForPlayerUpdate = (updatedPlayers, updatedPlayer, updateState, handleGameEvent, soundEffect) => {
  handleGameEvent(updatedPlayer);
  updatedPlayers[updatedPlayer.index] = updatePlayer(updatedPlayer, 0, 0);
  updateState({players: updatedPlayers})
  if (soundEffect) {
    soundEffect();
  }
}

export const queueForWeaponUpdate = (player, updateState, handleGameEvent, soundEffect, updatedWeapons) => {
  handleGameEvent(player);
  updateState({deployedWeapons: updatedWeapons})
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
      location: {x: 60, y: [80, BOARD_HEIGHT - 80][Math.floor(Math.random() * 2)]},
      angle: 1,
      trajectory: 0
    }
  } else {
    return {
      location: {x: BOARD_WIDTH - 60, y: [80, BOARD_HEIGHT - 80][Math.floor(Math.random() * 2)]},
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
  return {...player, gameEvent: pressedKey, rotate: pressedKey};
}

const handleAbility = (player, abilityData, handleGameEvent, updateState, pressedKey) => {
  const levelSum = abilityData.q.level + abilityData.w.level + abilityData.e.level;
  const ability = abilityData[pressedKey];

  if (player.level > levelSum && abilityData[pressedKey].level < 3) {
    updateState({abilityData: {...abilityData, [pressedKey]: {...ability, level: ability.level + 1}}});
  } else if (canUseAbility(ability, player, pressedKey) && ability.level > 0) {
    handleGameEvent({...player, gameEvent: 'ability', usedAbility: pressedKey, abilityLevel: abilityData[pressedKey].level});
    abilityData[pressedKey].lastUsed = Date.now()
    updateState({abilityData});
  }
}

const canUseAbility = (ability, player, pressedKey) => {
  return Date.now() - ability.lastUsed > ABILITIES[SHIPS[player.shipIndex].abilities[pressedKey]].cooldown
}

export const handleAiEvents = (eventData, team, handleGameEvent) => {
  let updatedEventData = {...eventData};
  updatedEventData.count += 1;
  if (updatedEventData.count % EVENT_DIVIDER === 0) {
    handleGameEvent({gameEvent: 'supplyShip'});
  };
  if (Date.now() - updatedEventData.lastSend > updatedEventData.sendInterval) {
    const opponentTeam = team === 'red' ? 'blue' : 'red';
    if (updatedEventData.shipCount < 3) {
      updatedEventData.shipCount += 1;
    } else {
      updatedEventData.shipHitpoints += 100
    }
    handleGameEvent({
      gameEvent: 'bombers',
      team: opponentTeam,
      shipCount: updatedEventData.shipCount,
      shipHitpoints: updatedEventData.shipHitpoints,
    });
    updatedEventData.lastSend = Date.now();
  }
  return updatedEventData;
}
