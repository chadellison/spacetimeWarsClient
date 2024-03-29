import { DRIFT } from '../constants/settings.js';
import { round } from '../helpers/mathHelpers.js';

export const newPlayer = (userId) => {
  return {
    userId,
    level: 1,
    gold: 1000,
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
    speed: DRIFT,
    maxSpeed: DRIFT,
    ability: {},
    location: { x: 0, y: 0 },
    explodeAnimation: { complete: true }
  }
};

export const findCurrentPlayer = (userId, players) => players.find(player => player.userId === userId);

export const playerCountDown = (activePlayer, clockDifference) => {
  const elapsedSeconds = (Date.now() + clockDifference - activePlayer.explodedAt) / 1000;
  return !activePlayer.active && elapsedSeconds < 10 ? round(10 - elapsedSeconds) : 0;
};
