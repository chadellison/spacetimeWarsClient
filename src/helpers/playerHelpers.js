import {round} from '../helpers/mathHelpers.js';

export const addPlayer = (userId, players) => {
  let startingPlayer = {
    userId: userId,
    team: 'red',
    gold: handleStartingGold(players),
    gameEvent: 'waiting',
    score: 0,
    items: {},
    effects: {},
    type: 'human',
    accelerate: false,
    lastAccelerationTime: 0,
    explodedAt: 0,
    kills: 0,
    rotate: 'none',
    ability: {},
    explodeAnimation: {}
  }
  return {
    modal: 'nameForm',
    startingPlayer: startingPlayer
  };
}

const handleStartingGold = (players) => {
  if (players.length > 0) {
    const scoreSums = players.filter((player) => player.type === 'human')
                             .reduce((accumulator, player) => {
      return accumulator + player.score
    }, 0);
    return round((scoreSums / players.length) + 1000);
  } else {
    return 1000;
  }
}
