import {round} from '../helpers/mathHelpers.js';

export const addPlayer = (userId, players) => {
  return {
    modal: 'nameForm',
    startingPlayer: newPlayer(userId, players)
  };
}

export const newPlayer = (userId, players) => {
  return {
    userId: userId,
    team: 'red',
    gold: handleStartingGold(players),
    gameEvent: 'waiting',
    score: 0,
    damage: 0,
    items: {},
    effects: {},
    type: 'human',
    accelerate: false,
    lastAccelerationTime: 0,
    explodedAt: 0,
    kills: 0,
    rotate: 'none',
    ability: {},
    explodeAnimation: { complete: true }
  }
}

const handleStartingGold = (players) => {
  if (players.length > 0) {
    const scoreSums = players.filter((player) => player.type === 'human')
                             .reduce((accumulator, player) => {
      return accumulator + player.score
    }, 0);
    return round((scoreSums / players.length) + 10000);
  } else {
    return 10000;
  }
}
