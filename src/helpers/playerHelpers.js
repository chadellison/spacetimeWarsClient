import {START_DATA} from '../constants/settings.js';

export const addPlayer = (userId, players) => {
  const startData = START_DATA[Math.floor(Math.random() * START_DATA.length)];
  return {
    modal: 'selection',
    currentPlayer: {
      id: userId,
      gold: handleStartingGold(players),
      gameEvent: 'waiting',
      score: 0,
      items: {},
      fire: false,
      location: startData.location,
      angle: startData.angle,
      trajectory: startData.trajectory
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
