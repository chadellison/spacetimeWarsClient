import {handleFireWeapon, updatePlayer} from '../helpers/gameLogic.js';
import {applyGameBuff} from '../helpers/effectHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {playSound, stopSound} from '../helpers/audioHelpers.js';
import {handleAbility} from '../helpers/abilityHelpers.js';
import {
  thruster,
  supplyPop,
  leakSound,
} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {players, clockDifference, deployedWeapons, userId, aiShips} = gameState;
  switch (playerData.gameEvent) {
    case 'start':
      return handleStartEvent(players, playerData, userId);
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
      return handleUpdateEvent([...players], playerData, clockDifference, deployedWeapons, elapsedTime);
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
      if (playerData.id === ship.id && !ship.explode) {
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
  player.explode = true;
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
      explode: true,
      active: false,
      explodeAnimation: {...EXPLOSION_ANIMATIONS[2], coordinates: {x: 0, y: 0}}
    }
  });
  const winningTeam = playerData.team === 'red' ? 'blue' : 'red'
  return {
    modal: 'gameOver',
    players: updatedPlayers,
    gameOverStats: {playerStats: players, winningTeam: winningTeam}
  }
}

const handleStartEvent = (players, playerData, userId) => {
  let newPlayers = [...players];
  newPlayers[playerData.index] = playerData

  if (userId === playerData.userId) {
    return {
      up: false,
      left: false,
      right: false,
      space: false,
      players: newPlayers,
      index: playerData.index
    }
  } else {
    return { players: newPlayers }
  }
}

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, elapsedTime) => {
  let updatedWeapons = [...deployedWeapons];
  let updatedPlayers = [...players];
  let updatedPlayer = players[playerData.index];

  switch (playerData.gameEvent) {
    case 'fire':
      updatedWeapons = [
        ...updatedWeapons,
        handleFireWeapon(
          playerData,
          clockDifference,
          {...WEAPONS[playerData.weaponIndex]},
          elapsedTime,
          updatedPlayer.damage
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
