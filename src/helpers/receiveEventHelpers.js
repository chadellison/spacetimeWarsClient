import {handleFireWeapon, updatePlayer} from '../helpers/gameLogic.js';
import {applyGameBuff} from '../helpers/effectHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {playSound, stopSound} from '../helpers/audioHelpers.js';
import {handleAbility} from '../helpers/abilityHelpers.js';
import {
  thruster,
  supplyPop,
  leakSound,
} from '../constants/settings.js';
import {WEAPONS} from '../constants/weapons.js';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {players, clockDifference, deployedWeapons, currentPlayer} = gameState;
  switch (playerData.gameEvent) {
    case 'start':
    case 'supplyShip':
      return handleStartEvent(players, playerData, currentPlayer.id);
    case 'remove':
      return handleRemoveEvent(players, playerData, currentPlayer);
    case 'buff':
      return handleBuffEvent(playerData, players, elapsedTime);
    case 'ability':
      return handleAbility(gameState, playerData, elapsedTime);
    case 'bombers':
      return { players: players.concat(playerData.bombers) };
    case 'leak':
      return handleLeak(playerData, gameState.defenseData);
    case 'gameOver':
      return handleGameOverEvent([...players], playerData)
    default:
      let allPlayers = [...players];
      if (players.filter((player) => player.id === playerData.id).length === 0) {
        allPlayers = [...players, playerData];
      };
      return handleUpdateEvent(allPlayers, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime);
  };
}

const handleLeak = (playerData, defenseData) => {
  const newValue = defenseData[playerData.team] - 1
  playSound(leakSound)
  return { defenseData: {...defenseData, [playerData.team]: newValue}}
}

const handleStartEvent = (players, playerData, currentPlayerId) => {
  if (currentPlayerId === playerData.id) {
    return {
      up: false,
      left: false,
      right: false,
      space: false,
      players: [...players, playerData]
    }
  } else {
    return { players: [...players, playerData] }
  }
}

const handleBuffEvent = (playerData, players, elapsedTime) => {
  const gameBuff = {...GAME_EFFECTS[playerData.buffIndex], durationCount: elapsedTime};
  const updatedPlayers = applyGameBuff(playerData.id, [...players], gameBuff);
  playSound(supplyPop);
  return {players: updatedPlayers, gameBuff: gameBuff};
};

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime) => {
  let updatedWeapons = [...deployedWeapons];
  let updatedPlayer;

  const updatedPlayers = [...players].map((player) => {
    if (playerData.id === player.id) {
      switch (playerData.gameEvent) {
        case 'fire':
          updatedWeapons = [
            ...updatedWeapons,
            handleFireWeapon(
              playerData,
              clockDifference,
              {...WEAPONS[playerData.weaponIndex]},
              elapsedTime,
              player.damage
            )
          ];

          updatedPlayer = player
          playSound(WEAPONS[player.weaponIndex].sound);
          break;
        case 'fireStop':
          updatedPlayer = player
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
      return updatedPlayer;
    } else {
      return player;
    };
  });

  return {
    players: updatedPlayers,
    deployedWeapons: updatedWeapons,
    currentPlayer: (currentPlayer.id === playerData.id ? updatedPlayer : currentPlayer)
  };
}

const handleRemoveEvent = (players, playerData, currentPlayer) => {
  let updatedCurrentPlayer = {...currentPlayer};
  const updatedPlayers = [...players].map((player) => {
    if (player.id === playerData.id) {
      if (!player.explode) {
        player.gameEvent = 'remove';
        player.hitpoints = 0;
        player.explodeAnimation = {x: 0, y: 0};
        player.explode = true;
        player.updatedAt = playerData.updatedAt;
        player.accelerate = false;
        player.angle = 0;
        player.trajectory = 0;
        player.rotate = 'none';
        player.effects = {};
        playerData = player;
      }
      if (playerData.id === currentPlayer.id) {
        updatedCurrentPlayer = player;
      };
    };
    return player;
  });

  return {
    players: updatedPlayers,
    currentPlayer: updatedCurrentPlayer
  };
}

const handleGameOverEvent = (players, playerData) => {
  const updatedPlayers = players.map((player) => {
    return {...player, explode: true, explodeAnimation: {x: 0, y: 0}}
  });
  return {
    modal: 'gameOver',
    currentPlayer: {},
    players: updatedPlayers,
    gameOverStats: playerData.gameOverStats
  }
}
