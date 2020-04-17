import {handleFireWeapon, updatePlayer} from '../helpers/gameLogic.js';
import {applyGameBuff} from '../helpers/effectHelpers.js';
import {GAME_EFFECTS} from '../constants/effects.js';

export const handleEventPayload = (gameState, playerData, elapsedTime) => {
  const {players, clockDifference, deployedWeapons, currentPlayer} = gameState;
  switch (playerData.gameEvent) {
    case 'start':
      return {players: [...players, playerData]};
    case 'remove':
      return handleRemoveEvent(players, playerData, currentPlayer);
    case 'buff':
      return handleBuffEvent(playerData, players, elapsedTime);
    default:
      let allPlayers = [...players];
      if (players.filter((player) => player.id === playerData.id).length === 0) {
        allPlayers = [...players, playerData];
      };
      return handleUpdateEvent(allPlayers, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime);
  };
}

const handleBuffEvent = (playerData, players, elapsedTime) => {
  const gameBuff = {...GAME_EFFECTS[playerData.buffIndex], durationCount: elapsedTime};

  const updatedPlayers = applyGameBuff(playerData.id, [...players], gameBuff);
  return {players: updatedPlayers, gameBuff: gameBuff};
};

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, currentPlayer, elapsedTime) => {
  let updatedWeapons = [...deployedWeapons];
  let updatedPlayer;

  const updatedPlayers = [...players].map((player) => {
    if (playerData.id === player.id) {
      if (playerData.gameEvent === 'fire') {
        updatedWeapons = [...updatedWeapons, handleFireWeapon(playerData, clockDifference)];
        updatedPlayer = player
      } else if (playerData.gameEvent === 'fireStop') {
        updatedPlayer = player
      } else {
        updatedPlayer = updatePlayer(playerData, elapsedTime, clockDifference);
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
