export const handleUpdate = (updateState, players, index, player) => {
  if (index !== null) {
    let updatedPlayers = [...players];
    updatedPlayers[index] = player
    updateState({players: updatedPlayers})
  } else {
    updateState({startingPlayer: player});
  }
}
