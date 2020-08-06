// ships
import hunterShip from '../images/redHunterShip.png';
import blueHunterShip from '../images/blueHunterShip.png';
import hunterShipAbsorb from '../images/hunterAbsorb.png';
import destroyerShip from '../images/destroyerShip.png';
import blueDestroyerShip from '../images/blueDestroyerShip.png';
import destroyerShipAbsorb from '../images/destroyerShipAbsorb.png';
import redWarShip from '../images/redWarShip.png';
import blueWarShip from '../images/blueWarShip.png';
import warShipAbsorb from '../images/warShipAbsorb.png';
import cruiserShip from '../images/cruiserShip.png';
import blueCruiserShip from '../images/blueCruiserShip.png';
import cruiserShipAbsorb from '../images/cruiserShipAbsorb.png';
import carrierShip from '../images/redCarrierShip.png';
import blueCarrierShip from '../images/blueCarrierShip.png';
import carrierShipAbsorb from '../images/carrierAbsorb.png';
import redStealthShip from '../images/redStealthShip.png';
import blueStealthShip from '../images/blueStealthShip.png';
import stealthShipAbsorb from '../images/stealthAbsorb.png';
import supplyShip from '../images/supplyShip.png';
import redBomber from '../images/redBomber.png';
import blueBomber from '../images/blueBomber.png';

export const SHIPS = [
  {
    index: 0,
    name: 'destroyer',
    price: 600,
    armor: 1,
    hitpoints: 900,
    speed: 2,
    shipCenter: {x: 60.5, y: 36},
    image: destroyerShip,
    blueImage: blueDestroyerShip,
    absorbImage: destroyerShipAbsorb,
    abilities: {q: 0, w: 12, e: 15},
  },
  {
    index: 1,
    name: 'hunter',
    price: 800,
    armor: 0,
    hitpoints: 700,
    speed: 2,
    shipCenter: {x: 60.5, y: 51},
    image: hunterShip,
    blueImage: blueHunterShip,
    absorbImage: hunterShipAbsorb,
    abilities: {q: 1, w: 6, e: 7}
  },
  {
    index: 2,
    name: 'warrior',
    price: 700,
    armor: 1,
    hitpoints: 700,
    speed: 2.5,
    shipCenter: {x: 60.5, y: 27},
    image: redWarShip,
    blueImage: blueWarShip,
    absorbImage: warShipAbsorb,
    abilities: {q: 2, w: 8, e: 14}
  },
  {
    index: 3,
    name: 'cruiser',
    price: 800,
    armor: 1,
    hitpoints: 800,
    speed: 3,
    shipCenter: {x: 60.5, y: 22.5},
    image: cruiserShip,
    blueImage: blueCruiserShip,
    absorbImage: cruiserShipAbsorb,
    abilities: {q: 3, w: 9, e: 11}
  },
  {
    index: 4,
    name: 'carrier',
    price: 900,
    armor: 2,
    hitpoints: 1000,
    speed: 2,
    shipCenter: {x: 60.5, y: 42.5},
    image: carrierShip,
    blueImage: blueCarrierShip,
    absorbImage: carrierShipAbsorb,
    abilities: {q: 4, w: 10, e: 16}
  },
  {
    index: 5,
    name: 'stealth',
    price: 850,
    armor: 1,
    hitpoints: 900,
    speed: 3,
    shipCenter: {x: 60.5, y: 57},
    image: redStealthShip,
    blueImage: blueStealthShip,
    absorbImage: stealthShipAbsorb,
    abilities: {q: 5, w: 13, e: 17}
  }
];

export const SUPPLY_SHIP = {
  name: 'supplyShip',
  shipCenter: {x: 60, y: 34},
  image: supplyShip
}

export const RED_BOMBER = {
  name: 'redBomber',
  shipCenter: {x: 60, y: 36},
  image: redBomber
}

export const BLUE_BOMBER = {
  name: 'blueBomber',
  shipCenter: {x: 60, y: 36},
  image: blueBomber
}
