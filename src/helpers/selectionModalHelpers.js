export const handleUpdate = (players, player) => ({ players: players.map(p => p.userId === player.userId ? player : p) });

export const handleHover = (hover, index) => {
  if (hover !== null) {
    return hover === index ? 'hovered' : 'dim'
  }
}