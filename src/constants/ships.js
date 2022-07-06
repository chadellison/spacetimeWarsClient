// ships
import hunterShip from '../images/redHunterShip.png';
import blueHunterShip from '../images/blueHunterShip.png';
import destroyerShip from '../images/redDestroyer.png';
import blueDestroyerShip from '../images/blueDestroyer.png';
import redWarShip from '../images/redWar.png';
import blueWarShip from '../images/blueWar.png';
import cruiserShip from '../images/redCruiser.png';
import blueCruiserShip from '../images/blueCruiser.png';
import carrierShip from '../images/redCarrierShip.png';
import blueCarrierShip from '../images/blueCarrierShip.png';
import redStealthShip from '../images/redStealthShip.png';
import blueStealthShip from '../images/blueStealthShip.png';
import commanderShip from '../images/commanderShip.png';
import blueCommanderShip from '../images/blueCommanderShip.png';
import supplyShip from '../images/supplyShip.png';
import redMothershipAnimation from '../images/mothershipAnimationRed.png'
import blueMothershipAnimation from '../images/mothershipAnimationBlue.png'
import { GAME_ANIMATIONS, BOARD_WIDTH, BOARD_HEIGHT } from './settings.js';

export const generateThrusterAnimation = (x, y) => {
  return {...GAME_ANIMATIONS[3], location: {x: 0, y: 0 }, coordinates: { x: 0, y: 0 }, xOffset: x, yOffset: y }
}

export const SHIPS = [
  {
    index: 0,
    name: 'destroyer',
    price: 700,
    armor: 1,
    hitpoints: 1900,
    speed: 2,
    shipCenter: {x: 60.5, y: 37.5},
    image: destroyerShip,
    blueImage: blueDestroyerShip,
    abilities: {q: 0, w: 12, e: 15},
    thrusterOffset: {x: 10, y: 2}
  },
  {
    index: 1,
    name: 'hunter',
    price: 800,
    armor: 0,
    hitpoints: 1600,
    speed: 2,
    shipCenter: {x: 60.5, y: 51},
    image: hunterShip,
    blueImage: blueHunterShip,
    abilities: {q: 1, w: 6, e: 7},
    thrusterOffset: {x: 20, y: 3}
  },
  {
    index: 2,
    name: 'warrior',
    price: 700,
    armor: 1,
    hitpoints: 1700,
    speed: 2.5,
    shipCenter: {x: 60.5, y: 18.5},
    image: redWarShip,
    blueImage: blueWarShip,
    abilities: {q: 2, w: 8, e: 14},
    thrusterOffset: {x: 10, y: 3}
  },
  {
    index: 3,
    name: 'cruiser',
    price: 850,
    armor: 1,
    hitpoints: 1600,
    speed: 3,
    shipCenter: {x: 60.5, y: 50.5},
    image: cruiserShip,
    blueImage: blueCruiserShip,
    abilities: {q: 3, w: 9, e: 11},
    thrusterOffset: {x: 24, y: 3}
  },
  {
    index: 4,
    name: 'carrier',
    price: 1100,
    armor: 3,
    hitpoints: 2900,
    speed: 3,
    shipCenter: {x: 60.5, y: 42.5},
    image: carrierShip,
    blueImage: blueCarrierShip,
    abilities: {q: 4, w: 10, e: 16},
    thrusterOffset: {x: 24, y: 3}
  },
  {
    index: 5,
    name: 'stealth',
    price: 800,
    armor: 1,
    hitpoints: 1900,
    speed: 3,
    shipCenter: {x: 60.5, y: 57},
    image: redStealthShip,
    blueImage: blueStealthShip,
    abilities: {q: 5, w: 13, e: 17},
    thrusterOffset: {x: 16, y: 3}
  },
  {
    index: 6,
    name: 'commander',
    price: 1250,
    armor: 3,
    hitpoints: 2400,
    speed: 3,
    shipCenter: {x: 60.5, y: 44},
    image: commanderShip,
    blueImage: blueCommanderShip,
    abilities: {q: 18, w: 19, e: 20},
    thrusterOffset: {x: 40, y: 4}
  }
];

export const SUPPLY_SHIP = {
  name: 'supplyShip',
  shipCenter: {x: 60, y: 34},
  image: supplyShip,
}

export const MOTHER_SHIP = {
  name: 'redMothership',
  type: 'bomber',
  armor: 5,
  hitpoints: 5000,
  maxHitpoints: 5000,
  shipCenter: {x: 100, y: 54},
  effects: {},
  items: {},
  angle: 0,
  width: 200,
  height: 108,
  active: true
}

export const mothershipItems = {
  1: { index: 0, cooldown: 120000, durationCount: 5000 },
  2: { index: 1, durationCount: 1000, cooldown: 3000 },
  4: { index: 3, durationCount: 10000, cooldown: 30000 },
  5: { index: 4, durationCount: 0, cooldown: 0 },
  10: { index: 9, durationCount: 0, cooldown: 0 }
}

const mothershipAnimation = {
  spriteImage: redMothershipAnimation,
  location: {x: 0, y: 0},
  coordinates: {x: 0, y: 0},
  width: 200,
  height: 108,
  renderWidth: 200,
  renderHeight: 108,
  rowCount: 252,
  columnCount: 1,
  rate: 0,
  startRate: 0,
  xOffset: 0,
  yOffset: 0
}

export const motherships = [
  {...MOTHER_SHIP, name:
    'redMothership',
    location: {x: 50, y: 50},
    team: 'red',
    effects: {},
    items: { ...mothershipItems },
    animation: {...mothershipAnimation, spriteImage: redMothershipAnimation }
  },
  {...MOTHER_SHIP,
    name: 'blueMothership',
    location: {x: BOARD_WIDTH - 250, y: BOARD_HEIGHT - 159},
    team: 'blue',
    effects: {},
    items: { ...mothershipItems },
    animation: {...mothershipAnimation, spriteImage: blueMothershipAnimation }
  }
]

export const BOMBERS = [
  {
    index: 0,
    active: true,
    type: 'bomber',
    shipName: 'destroyer',
    armor: 0,
    hitpoints: 200,
    maxHitpoints: 200,
    velocity: 1,
    accelerate: true,
    weaponIndex: 0,
    effects: {},
    items: {},
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 37.5},
    image: destroyerShip,
    blueImage: blueDestroyerShip,
    thrusterAnimation: generateThrusterAnimation(10, 3)
  },
  {
    index: 1,
    active: true,
    type: 'bomber',
    shipName: 'hunter',
    armor: 1,
    hitpoints: 600,
    maxHitpoints: 600,
    velocity: 2,
    weaponIndex: 6,
    accelerate: true,
    effects: {},
    items: {},
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 51},
    image: hunterShip,
    blueImage: blueHunterShip,
    thrusterAnimation: generateThrusterAnimation(20, 3)
  },
  {
    index: 2,
    active: true,
    type: 'bomber',
    shipName: 'warrior',
    armor: 3,
    hitpoints: 1200,
    maxHitpoints: 1200,
    velocity: 1,
    weaponIndex: 2,
    accelerate: true,
    effects: {},
    items: {},
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 18.5},
    image: redWarShip,
    blueImage: blueWarShip,
    thrusterAnimation: generateThrusterAnimation(10, 3)
  },
  {
    index: 3,
    active: true,
    type: 'bomber',
    shipName: 'cruiser',
    armor: 1,
    hitpoints: 1800,
    maxHitpoints: 1800,
    velocity: 3,
    weaponIndex: 5,
    accelerate: true,
    effects: {},
    items: {},
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 50.5},
    image: cruiserShip,
    blueImage: blueCruiserShip,
    thrusterAnimation: generateThrusterAnimation(24, 3)
  },
  {
    index: 4,
    active: true,
    type: 'bomber',
    shipName: 'stealth',
    armor: 4,
    hitpoints: 2400,
    maxHitpoints: 2400,
    velocity: 2,
    weaponIndex: 7,
    accelerate: true,
    effects: {},
    items: {},
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 57},
    image: redStealthShip,
    blueImage: blueStealthShip,
    thrusterAnimation: generateThrusterAnimation(16, 3)
  },
];
