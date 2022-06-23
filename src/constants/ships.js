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
import supplyShip from '../images/supplyShip.png';

import redBomber from '../images/redBomber.png';
import redBomber2 from '../images/redBomberShip2.png';
import redBomber3 from '../images/redBomber3.png';
import redBomber4 from '../images/redBomber4.png';
import redBomber5 from '../images/redBomber5.png';
import blueBomber from '../images/blueBomber.png';
import blueBomber2 from '../images/blueBomberShip2.png';
import blueBomber3 from '../images/blueBomber3.png';
import blueBomber4 from '../images/blueBomber4.png';
import blueBomber5 from '../images/blueBomber5.png';

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
    abilities: {q: 1, w: 6, e: 7}
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
    abilities: {q: 2, w: 8, e: 14}
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
    abilities: {q: 3, w: 9, e: 11}
  },
  {
    index: 4,
    name: 'carrier',
    price: 800,
    armor: 2,
    hitpoints: 2100,
    speed: 2,
    shipCenter: {x: 60.5, y: 42.5},
    image: carrierShip,
    blueImage: blueCarrierShip,
    abilities: {q: 4, w: 10, e: 16}
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
    abilities: {q: 5, w: 13, e: 17}
  }
];

export const SUPPLY_SHIP = {
  name: 'supplyShip',
  shipCenter: {x: 60, y: 34},
  image: supplyShip
}

export const BOMBERS = [
  {
    index: 0,
    active: true,
    type: 'bomber',
    shipName: 'b1',
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
    shipCenter: {x: 60.5, y: 57},
    image: redBomber,
    blueImage: blueBomber,
  },
  {
    index: 1,
    active: true,
    type: 'bomber',
    shipName: 'b2',
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
    shipCenter: {x: 60.5, y: 57},
    image: redBomber2,
    blueImage: blueBomber2,
  },
  {
    index: 2,
    active: true,
    type: 'bomber',
    shipName: 'b3',
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
    shipCenter: {x: 60.5, y: 57},
    image: redBomber3,
    blueImage: blueBomber3,
  },
  {
    index: 3,
    active: true,
    type: 'bomber',
    shipName: 'b4',
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
    shipCenter: {x: 60.5, y: 57},
    image: redBomber4,
    blueImage: blueBomber4,
  },
  {
    index: 4,
    active: true,
    type: 'bomber',
    shipName: 'b5',
    armor: 4,
    hitpoints: 2400,
    maxHitpoints: 2400,
    velocity: 2,
    weaponIndex: 7,
    accelerate: true,
    effects: {},
    items: { 10: { index: 9, durationCount: 0, cooldown: 0 } },
    score: 0,
    rotate: 'none',
    explodeAnimation: {},
    shipCenter: {x: 60.5, y: 57},
    image: redBomber5,
    blueImage: blueBomber5,
  },
];
