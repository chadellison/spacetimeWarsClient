// weapons
import fireball from '../images/fireball.png';
import displayFireball from '../images/displayFireball.jpeg';
import torpedo from '../images/torpedo.png';
import displayTorpedo from '../images/displayTorpedo.png';
import trifecta from '../images/trifecta.png';
import displayTrifecta from '../images/displayTrifecta.png';
import plasmaCannon from '../images/plasmaCannon.png';
import displayPlasmaCannon from '../images/displayPlasmaCannon.png';
import bomb from '../images/bomb.png';
import displayBomb from '../images/displayBomb.png';
import laser from '../images/laser.png';
import displayLaser from '../images/displayLaser.png';

// ships
import fighterShip from '../images/fighterShip.png';
import hunterShip from '../images/hunterShip.png';
import destroyerShip from '../images/destroyerShip.png';
import scoutShip from '../images/scoutShip.png';
import warShip from '../images/warShip.png';
import cruiserShip from '../images/cruiserShip.png';
import carrierShip from '../images/carrierShip.png';
import stealthShip from '../images/stealthShip.png';

// defense
import shield from '../images/shield.jpg';

// audio
import thrusterAudio from '../audio/thruster.wav';
import cannonAudio from '../audio/cannon.wav';
import missileAudio from '../audio/missile.wav';
import trifectaAudio from '../audio/trifecta.wav';
import bombAudio from '../audio/bomb.wav';
import plasmaCannonAudio from '../audio/plasmaSound.wav';
import laserAudio from '../audio/laser.wav';
import gongAudio from '../audio/gong.wav';
import loadWeaponAudio from '../audio/loadWeapon.wav';
import notEnoughResourcesAudio from '../audio/notEnoughResources.wav';

// constants
export const BOARD_WIDTH = 980;
export const BOARD_HEIGHT = 665;
export const ANAIMATION_FRAME_RATE = 30;
export const REQUEST_COUNT = 10;
export const DRIFT = 2;
export const SPRITE_WIDTH = 256;
export const SPRITE_ROW_COUNT = 8;
export const SPRITE_COLUMN_COUNT = 6;
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
    width: 16,
    height: 16,
    sound: new Audio(cannonAudio),
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
    width: 40,
    height: 15,
    sound: new Audio(missileAudio),
    image: torpedo,
    selectionImage: displayTorpedo
  },
  {
    index: 2,
    name: 'bomb',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 800,
    speed: 10,
    damage: 400,
    price: 400,
    width: 50,
    height: 29,
    image: bomb,
    sound: new Audio(bombAudio),
    selectionImage: displayBomb
  },
  {
    index: 3,
    name: 'laser',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 20,
    damage: 200,
    price: 500,
    width: 40,
    height: 16,
    image: laser,
    sound: new Audio(laserAudio),
    selectionImage: displayLaser
  },
  {
    index: 4,
    name: 'trifecta',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 300,
    speed: 20,
    damage: 300,
    price: 700,
    width: 32,
    height: 32,
    image: trifecta,
    sound: new Audio(trifectaAudio),
    selectionImage: displayTrifecta
  },
  {
    index: 5,
    name: 'plasmaCannon',
    location: {x: 0, y: 0},
    trajectory: 0,
    cooldown: 400,
    speed: 20,
    damage: 350,
    price: 500,
    width: 16,
    height: 16,
    image: plasmaCannon,
    sound: new Audio(plasmaCannonAudio),
    selectionImage: displayPlasmaCannon
  },
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
    shipCenter: {x: 60.5, y: 36},
    image: destroyerShip
  },
  {
    index: 2,
    name: 'hunterShip',
    price: 750,
    armor: 1,
    hitpoints: 900,
    speed: 3,
    shipCenter: {x: 60.5, y: 35},
    image: hunterShip
  },
  {
    index: 3,
    name: 'scoutShip',
    price: 550,
    armor: 0,
    hitpoints: 500,
    speed: 4,
    shipCenter: {x: 60.5, y: 32},
    image: scoutShip
  },
  {
    index: 4,
    name: 'warShip',
    price: 1300,
    armor: 3,
    hitpoints: 1400,
    speed: 4,
    shipCenter: {x: 60.5, y: 27},
    image: warShip
  },
  {
    index: 5,
    name: 'cruiserShip',
    price: 900,
    armor: 2,
    hitpoints: 800,
    speed: 5.5,
    shipCenter: {x: 60.5, y: 22.5},
    image: cruiserShip
  },
  {
    index: 6,
    name: 'carrierShip',
    price: 1700,
    armor: 4,
    hitpoints: 3000,
    speed: 3.5,
    shipCenter: {x: 60.5, y: 29},
    image: carrierShip
  },
  {
    index: 7,
    name: 'stealthShip',
    price: 1350,
    armor: 2,
    hitpoints: 1400,
    speed: 4.5,
    shipCenter: {x: 60, y: 34},
    image: stealthShip
  }
];

export const DEFENSES = [
  {
    index: 0,
    price: 200,
    name: 'Armor upgrade',
    image: shield,
    description: 'Upgrades armor by one up to 5'
  },
  {
    index: 1,
    price: 200,
    name: 'Hitpoints',
    image: shield,
    description: 'Permanantly increases hitpoints by 200'
  },
  {
    index: 2,
    price: 700,
    name: 'Health boost',
    image: shield,
    description: 'Boosts hitpoints to %50 of max hitpoints when hitpoints drop below %25 (120 second cooldown)'
  },
  {
    index: 3,
    price: 800,
    name: 'Repair bots',
    image: shield,
    description: 'Repairs 1% of total hitpoints every second'
  },
];

export const OTHER_ITEMS = [
  {
    index: 3,
    price: 800,
    name: '1 Up',
    description: 'Adds an extra life'
  }
];

export const thruster = new Audio(thrusterAudio);
thruster.loop = true;

export const gong = new Audio(gongAudio);
export const loadWeapon = new Audio(loadWeaponAudio);
export const notEnoughResources = new Audio(notEnoughResourcesAudio);
