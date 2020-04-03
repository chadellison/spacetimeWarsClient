export const addPlayer = (userId, players) => {
  return {
    modal: 'selection',
    currentPlayer: {
      id: userId,
      gold: handleStartingGold(players),
      gameEvent: 'waiting',
      score: 0,
      items: {}
    }
  };
}

const handleStartingGold = (players) => {
  if (players.length > 0) {
    const scoreSums = players.reduce((accumulator, player) => {
      return accumulator + player.score
    }, 0);
    return Math.round((scoreSums / players.length) + 1000);
  } else {
    return 1000;
  }
}
