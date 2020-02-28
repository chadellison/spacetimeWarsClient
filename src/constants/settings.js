export const BOARD_WIDTH = 980;
export const BOARD_HEIGHT = 665;
export const ANAIMATION_FRAME_RATE = 30;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
export const DRIFT_DECAY_TIME = 5000;
export const WEAPONS = {
  1: {
    name: 'fireball',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 15,
    damage: 50
  }
};

export const SHIPS = [
  {index: 0, price: 700, armor: 2, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 1, price: 700, armor: 2, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 2, price: 700, armor: 2, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 3, price: 700, armor: 2, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}}
];
