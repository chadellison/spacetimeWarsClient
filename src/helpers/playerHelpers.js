export const addPlayer = (userId, players) => {
  return {
    modal: 'nameForm',
    currentPlayer: {
      id: userId,
      gold: handleStartingGold(players),
      gameEvent: 'waiting',
      score: 0,
      items: {},
      effects: {}
    }
  };
}

const handleStartingGold = (players) => {
  if (players.length > 0) {
    const scoreSums = players.filter((player) => player.type === 'human').reduce((accumulator, player) => {
      return accumulator + player.score
    }, 0);
    return Math.round((scoreSums / players.length) + 10000);
  } else {
    return 10000;
  }
}
