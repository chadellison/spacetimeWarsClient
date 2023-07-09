export const handleUpdate = (players, player) => {
  if (player.inPlayers) {
    const updatedPlayers = players.map((p) => {
      if (p.userId === player.userId) {
        return player;
      } else {
        return p;
      }
    })
    return { players: updatedPlayers }
  } else {
    return { startingPlayer: player };
  }
}
