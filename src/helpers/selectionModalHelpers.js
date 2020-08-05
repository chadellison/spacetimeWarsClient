export const handleUpdate = (players, player) => {
  if (player.index >= 0) {
    let updatedPlayers = [...players];
    updatedPlayers[player.index] = player
    return {players: updatedPlayers}
  } else {
    return {startingPlayer: player};
  }
}
