// ships
import hunterShip from '../images/hunterShip.png';
import blueHunterShip from '../images/blueHunterShip.png';
import hunterShipAbsorb from '../images/hunterShipAbsorb.png';
import destroyerShip from '../images/destroyerShip.png';
import blueDestroyerShip from '../images/blueDestroyerShip.png';
import destroyerShipAbsorb from '../images/destroyerShipAbsorb.png';
import redWarShip from '../images/redWarShip.png';
import blueWarShip from '../images/blueWarShip.png';
import warShipAbsorb from '../images/warShipAbsorb.png';
import cruiserShip from '../images/cruiserShip.png';
import blueCruiserShip from '../images/blueCruiserShip.png';
import cruiserShipAbsorb from '../images/cruiserShipAbsorb.png';
import carrierShip from '../images/carrierShip.png';
import blueCarrierShip from '../images/blueCarrierShip.png';
import carrierShipAbsorb from '../images/carrierShipAbsorb.png';
import redStealthShip from '../images/redStealthShip.png';
import blueStealthShip from '../images/blueStealthShip.png';
import stealthShipAbsorb from '../images/stealthShipAbsorb.png';
import supplyShip from '../images/supplyShip.png';
import redBomber from '../images/redBomber.png';
import blueBomber from '../images/blueBomber.png';

export const SHIPS = [
  {
    index: 0,
    name: 'destroyerShip',
    price: 600,
    armor: 1,
    hitpoints: 900,
    speed: 2,
    shipCenter: {x: 60.5, y: 36},
    image: destroyerShip,
    blueImage: blueDestroyerShip,
    absorbImage: destroyerShipAbsorb,
    abilities: {q: 0, w: 6},
  },
  {
    index: 1,
    name: 'hunterShip',
    price: 800,
    armor: 0,
    hitpoints: 700,
    speed: 3,
    shipCenter: {x: 60.5, y: 35},
    image: hunterShip,
    blueImage: blueHunterShip,
    absorbImage: hunterShipAbsorb,
    abilities: {q: 1, w: 7}
  },
  {
    index: 2,
    name: 'warShip',
    price: 700,
    armor: 1,
    hitpoints: 700,
    speed: 4,
    shipCenter: {x: 60.5, y: 27},
    image: redWarShip,
    blueImage: blueWarShip,
    absorbImage: warShipAbsorb,
    abilities: {q: 2, w: 8}
  },
  {
    index: 3,
    name: 'cruiserShip',
    price: 800,
    armor: 1,
    hitpoints: 800,
    speed: 4.5,
    shipCenter: {x: 60.5, y: 22.5},
    image: cruiserShip,
    blueImage: blueCruiserShip,
    absorbImage: cruiserShipAbsorb,
    abilities: {q: 3, w: 9}
  },
  {
    index: 4,
    name: 'carrierShip',
    price: 900,
    armor: 2,
    hitpoints: 1000,
    speed: 3,
    shipCenter: {x: 60.5, y: 29},
    image: carrierShip,
    blueImage: blueCarrierShip,
    absorbImage: carrierShipAbsorb,
    abilities: {q: 4, w: 10}
  },
  {
    index: 5,
    name: 'stealthShip',
    price: 850,
    armor: 1,
    hitpoints: 900,
    speed: 4.5,
    shipCenter: {x: 60, y: 34},
    image: redStealthShip,
    blueImage: blueStealthShip,
    absorbImage: stealthShipAbsorb,
    abilities: {q: 5, w: 11}
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
