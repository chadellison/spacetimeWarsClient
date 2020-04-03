// ships
import hunterShip from '../images/hunterShip.png';
import hunterShipAbsorb from '../images/hunterShipAbsorb.png';
import destroyerShip from '../images/destroyerShip.png';
import destroyerShipAbsorb from '../images/destroyerShipAbsorb.png';
import warShip from '../images/warShip.png';
import warShipAbsorb from '../images/warShipAbsorb.png';
import cruiserShip from '../images/cruiserShip.png';
import cruiserShipAbsorb from '../images/cruiserShipAbsorb.png';
import carrierShip from '../images/carrierShip.png';
import carrierShipAbsorb from '../images/carrierShipAbsorb.png';
import stealthShip from '../images/stealthShip.png';
import stealthShipAbsorb from '../images/stealthShipAbsorb.png';
import supplyShip from '../images/supplyShip.png';

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
    absorbImage: destroyerShipAbsorb
  },
  {
    index: 1,
    name: 'hunterShip',
    price: 550,
    armor: 0,
    hitpoints: 700,
    speed: 3,
    shipCenter: {x: 60.5, y: 35},
    image: hunterShip,
    absorbImage: hunterShipAbsorb
  },
  {
    index: 2,
    name: 'warShip',
    price: 700,
    armor: 1,
    hitpoints: 700,
    speed: 4,
    shipCenter: {x: 60.5, y: 27},
    image: warShip,
    absorbImage: warShipAbsorb
  },
  {
    index: 3,
    name: 'cruiserShip',
    price: 800,
    armor: 0,
    hitpoints: 800,
    speed: 5.5,
    shipCenter: {x: 60.5, y: 22.5},
    image: cruiserShip,
    absorbImage: cruiserShipAbsorb
  },
  {
    index: 4,
    name: 'carrierShip',
    price: 800,
    armor: 2,
    hitpoints: 900,
    speed: 3,
    shipCenter: {x: 60.5, y: 29},
    image: carrierShip,
    absorbImage: carrierShipAbsorb
  },
  {
    index: 5,
    name: 'stealthShip',
    price: 800,
    armor: 1,
    hitpoints: 900,
    speed: 4.5,
    shipCenter: {x: 60, y: 34},
    image: stealthShip,
    absorbImage: stealthShipAbsorb
  }
];

export const SUPPLY_SHIP = {
  index: 5,
  name: 'supplyShip',
  armor: 0,
  shipCenter: {x: 60, y: 34},
  image: supplyShip
}
