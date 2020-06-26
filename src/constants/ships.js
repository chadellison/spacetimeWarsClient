// ships
import hunterShip from '../images/hunterShip.png';
import blueHunterShip from '../images/blueHunterShip.png';
import hunterShipAbsorb from '../images/hunterShipAbsorb.png';
import destroyerShip from '../images/destroyerShip.png';
import blueDestroyerShip from '../images/blueDestroyerShip.png';
import destroyerShipAbsorb from '../images/destroyerShipAbsorb.png';
import warShip from '../images/warShip.png';
import blueWarShip from '../images/blueWarShip.png';
import warShipAbsorb from '../images/warShipAbsorb.png';
import cruiserShip from '../images/cruiserShip.png';
import blueCruiserShip from '../images/blueCruiserShip.png';
import cruiserShipAbsorb from '../images/cruiserShipAbsorb.png';
import carrierShip from '../images/carrierShip.png';
import blueCarrierShip from '../images/blueCarrierShip.png';
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
    blueImage: blueDestroyerShip,
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
    blueImage: blueHunterShip,
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
    blueImage: blueWarShip,
    absorbImage: warShipAbsorb
  },
  {
    index: 3,
    name: 'cruiserShip',
    price: 875,
    armor: 1,
    hitpoints: 800,
    speed: 5.5,
    shipCenter: {x: 60.5, y: 22.5},
    image: cruiserShip,
    blueImage: blueCruiserShip,
    absorbImage: cruiserShipAbsorb
  },
  {
    index: 4,
    name: 'carrierShip',
    price: 825,
    armor: 2,
    hitpoints: 1000,
    speed: 3,
    shipCenter: {x: 60.5, y: 29},
    image: carrierShip,
    blueImage: blueCarrierShip,
    absorbImage: carrierShipAbsorb
  },
  {
    index: 5,
    name: 'stealthShip',
    price: 850,
    armor: 1,
    hitpoints: 900,
    speed: 4.5,
    shipCenter: {x: 60, y: 34},
    image: stealthShip,
    blueImage: stealthShip,
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
