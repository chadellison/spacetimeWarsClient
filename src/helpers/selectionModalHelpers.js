export const handleUpdate = (players, player) => {
  if (player.index >= 0) {
    const updatedPlayers = [...players].map((p) => {
      if (p.userId === player.userId) {
        return player;
      } else {
        return p;
      }
    })
    return {players: updatedPlayers}
  } else {
    return {startingPlayer: player};
  }
}
