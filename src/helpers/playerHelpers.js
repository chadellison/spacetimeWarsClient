import {round} from '../helpers/mathHelpers.js';

export const addPlayer = (userId, players) => {
  return {
    modal: 'nameForm',
    currentPlayer: {
      id: userId,
      gold: handleStartingGold(players),
      gameEvent: 'waiting',
      score: 0,
      items: {},
      effects: {},
      type: 'human',
      accelerate: false,
      lastAccelerationTime: 0,
      kills: 0,
      rotate: 'none',
      explode: false,
      ability: {},
      explodeAnimation: {}
    }
  };
}

const handleStartingGold = (players) => {
  if (players.length > 0) {
    const scoreSums = players.filter((player) => player.type === 'human').reduce((accumulator, player) => {
      return accumulator + player.score
    }, 0);
    return round((scoreSums / players.length) + 10000);
  } else {
    return 10000;
  }
}
