export const handleUpdate = (players, index, player) => {
  if (index !== null) {
    let updatedPlayers = [...players];
    updatedPlayers[index] = player
    return {players: updatedPlayers}
  } else {
    return {startingPlayer: player};
  }
}
