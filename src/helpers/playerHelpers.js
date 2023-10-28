import { round } from '../helpers/mathHelpers.js';

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
    level: handleStartingLevel(players),
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
    return round((scoreSums / players.length) + 1000);
  } else {
    return 1000;
  }
}

const handleStartingLevel = (players) => {
  if (players.length > 0) {
    const levelSums = players.filter((player) => player.type === 'human')
      .reduce((accumulator, player) => {
        return accumulator + player.level
      }, 0);
    return round((levelSums / players.length) + 1);
  } else {
    return 1;
  }
}

export const findCurrentPlayer = (userId, players) => players.find(player => player.userId === userId);

export const playerCountDown = (activePlayer, clockDifference) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  return !activePlayer.active && elapsedSeconds < 10 ? round(10 - elapsedSeconds) : 0;
}