import {
  findElapsedTime,
  handleFireWeapon,
  updatePlayer
} from '../helpers/gameLogic.js';

export const handleEventPayload = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
  switch (playerData.gameEvent) {
    case 'start':
    case 'supplyShip':
      return {players: [...players, playerData]};
    case 'remove':
      return handleRemoveEvent(players, playerData, currentPlayer);
    default:
      let allPlayers = [...players];
      if (players.filter((player => player.id === playerData.id)).length === 0) {
        allPlayers = [...players, playerData];
      };
      return handleUpdateEvent(allPlayers, playerData, clockDifference, deployedWeapons, currentPlayer);
  };
}

const handleUpdateEvent = (players, playerData, clockDifference, deployedWeapons, currentPlayer) => {
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
        const elapsedTime = findElapsedTime(clockDifference, playerData.updatedAt);
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
    currentPlayer: updatedCurrentPlayer,
    up: false,
    left: false,
    right: false,
    space: false
  };
}
