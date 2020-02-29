import fireball from '../images/fireball.png';
import displayFireball from '../images/displayFireball.jpeg';
import torpedo from '../images/torpedo.png';
import displayTorpedo from '../images/displayTorpedo.png';
import fighterShip from '../images/fighterShip.png';
import hunterShip from '../images/hunterShip.png';
import destroyerShip from '../images/destroyerShip.png';
import scoutShip from '../images/scoutShip.png';
export const BOARD_WIDTH = 980;
export const BOARD_HEIGHT = 665;
export const ANAIMATION_FRAME_RATE = 30;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
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
  {
    index: 0,
    name: 'fighterShip',
    price: 700,
    armor: 1,
    hitpoints: 650,
    speed: 4,
    shipCenter: {x: 60.5, y: 38},
    image: fighterShip
  },
  {
    index: 1,
    name: 'destroyerShip',
    price: 800,
    armor: 2,
    hitpoints: 1100,
    speed: 2,
    shipCenter: {x: 60.5, y: 38},
    image: destroyerShip
  },
  {
    index: 2,
    name: 'hunterShip',
    price: 800,
    armor: 1,
    hitpoints: 900,
    speed: 3,
    shipCenter: {x: 60.5, y: 38},
    image: hunterShip
  },
  {
    index: 3,
    name: 'scoutShip',
    price: 500,
    armor: 0,
    hitpoints: 600,
    speed: 4,
    shipCenter: {x: 60.5, y: 38},
    image: scoutShip
  }
];
