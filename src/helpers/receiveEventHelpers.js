import {handleFireWeapon, updatePlayer} from '../helpers/gameLogic.js';
import {applyGameBuff} from '../helpers/effectHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {playSound, stopSound} from '../helpers/audioHelpers.js';
import {handleAbility} from '../helpers/abilityHelpers.js';
import {round} from '../helpers/mathHelpers.js';
import {
  thruster,
  supplyPop,
  leakSound,
} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {players, clockDifference, deployedWeapons, userId, aiShips, index, eventData} = gameState;
  switch (playerData.gameEvent) {
    case 'start':
      return handleStartEvent(players, playerData, userId, eventData);
    case 'explode':
      return handleExplodeEvent(players, aiShips, playerData, elapsedTime);
    case 'supplyShip':
      return {aiShips: [...aiShips, playerData]}
    case 'bombers':
      return {aiShips: aiShips.concat(playerData.bombers)}
    case 'ability':
      return handleAbility(gameState, playerData, elapsedTime);
    case 'leak':
      return handleLeakEvent(playerData, gameState.players);
    default:
      if (index !== playerData.index) {
        return handleUpdateEvent([...players], playerData, clockDifference, deployedWeapons, elapsedTime);
      }
  };
}

const handleExplodeEvent = (players, aiShips, playerData, elapsedTime) => {
  if (playerData.type === 'human') {
    let updatedPlayers = [...players];
    let player = updatedPlayers[playerData.index]
    player = explodePlayer(player, playerData);
    updatedPlayers[playerData.index] = player
    return {players: updatedPlayers}
  } else {
    let updatedAiShips = [...aiShips].map((ship) => {
      if (playerData.id === ship.id && ship.active) {
        ship = explodePlayer(ship, ship)
      };
      return ship;
    });

    if (playerData.type === 'supplyShip') {
      return handleBuff(playerData, players, updatedAiShips, elapsedTime);
    } else {
      return {aiShips: updatedAiShips};
    }
  }
}

const handleBuff = (playerData, players, aiShips, elapsedTime) => {
  const gameBuff = {...GAME_EFFECTS[playerData.buffIndex], durationCount: elapsedTime};
  const team = players[playerData.killedBy].team;
  const updatedPlayers = applyGameBuff(team, [...players], gameBuff);
  const updatedAiShips = applyGameBuff(team, aiShips, gameBuff);
  playSound(supplyPop);
  return {players: updatedPlayers, gameBuff: gameBuff, aiShips: updatedAiShips};
}

const explodePlayer = (player, playerData) => {
  player.hitpoints = 0;
  player.explodeAnimation = {...EXPLOSION_ANIMATIONS[2], coordinates: {x: 0, y: 0}}
  player.updatedAt = playerData.updatedAt;
  player.explodedAt = playerData.explodedAt;
  player.accelerate = false;
  player.angle = 0;
  player.trajectory = 0;
  player.rotate = 'none';
  player.effects = {};
  player.active = false;
  player.gameEvent = 'waiting';
  return player;
}

const handleLeakEvent = (playerData, players) => {
  playSound(leakSound)
  if (playerData.defenseData[playerData.team] < 1) {
    return handleGameOver(players, playerData);
  } else {
    return { defenseData: playerData.defenseData }
  }
}

const handleGameOver = (players, playerData) => {
  const updatedPlayers = players.map((player) => {
    return {
      ...player,
      active: false,
      explodeAnimation: {...EXPLOSION_ANIMATIONS[2], coordinates: {x: 0, y: 0}}
    }
  });
  const winningTeam = playerData.team === 'red' ? 'blue' : 'red'
  return {
    modal: 'gameOver',
    players: updatedPlayers,
    aiShips: [],
    gameOverStats: {playerStats: players, winningTeam: winningTeam}
  }
}

const handleStartEvent = (players, playerData, userId, eventData) => {
  let newPlayers = [...players];
  newPlayers[playerData.index] = playerData

  const updatedEventData = {...eventData, sendInterval: handleSendInterval(newPlayers)}

  if (userId === playerData.userId) {
    return {
      up: false,
      left: false,
      right: false,
      space: false,
      players: newPlayers,
      index: playerData.index,
      eventData: updatedEventData,
    }
  } else {
    return { players: newPlayers, eventData, updatedEventData }
  }
}

const handleSendInterval = (players) => {
  let red = 0;
  let blue = 0;
  players.forEach((player) => {
    if (player.team === 'red') {
      red += 1;
    } else {
      blue += 1;
    }
  });
  if ([red, blue].includes(0)) {
    return 15000;
  } else {
    return 60000;
  }
}

export const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, elapsedTime) => {
  let updatedWeapons = [...deployedWeapons];
  let updatedPlayers = [...players];
  let updatedPlayer = players[playerData.index];

  switch (playerData.gameEvent) {
    case 'fire':
      let damage = updatedPlayer.damage;
      damage = updatedPlayer.effects[11] ? damage + round(damage * 0.25) : damage
      updatedWeapons = [
        ...updatedWeapons,
        handleFireWeapon(
          playerData,
          {...WEAPONS[playerData.weaponIndex]},
          elapsedTime,
          damage
        )
      ];

      playSound(WEAPONS[updatedPlayer.weaponIndex].sound);
      break;
    case 'fireStop':
      break;
    case 'up':
      updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
      playSound(thruster);
      break;
    case 'upStop':
      updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
      stopSound(thruster);
      break;
    default:
      updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
      break;
  }
  updatedPlayers[playerData.index] = updatedPlayer

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
  };
}
