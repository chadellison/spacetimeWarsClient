import fireball from '../images/fireball.png';
import displayFireball from '../images/displayFireball.jpeg';
import torpedo from '../images/torpedo.png';
import displayTorpedo from '../images/displayTorpedo.png';
export const BOARD_WIDTH = 980;
export const BOARD_HEIGHT = 665;
export const ANAIMATION_FRAME_RATE = 30;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
export const DRIFT_DECAY_TIME = 5000;
export const WEAPONS = [
  {
    index: 0,
    name: 'fireball',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 15,
    damage: 50,
    price: 200,
    image: fireball,
    selectionImage: displayFireball
  },
  {
    index: 1,
    name: 'torpedo',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 500,
    speed: 20,
    damage: 100,
    price: 300,
    image: torpedo,
    selectionImage: displayTorpedo
  }
];

export const SHIPS = [
  {index: 0, price: 700, armor: 1, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 1, price: 700, armor: 1, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 2, price: 700, armor: 1, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}},
  {index: 3, price: 700, armor: 1, hitpoints: 650, speed: 4, shipCenter: {x: 60.5, y: 38}}
];
