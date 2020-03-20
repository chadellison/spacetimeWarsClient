// ships
import fighterShip from '../images/fighterShip.png';
import hunterShip from '../images/hunterShip.png';
import destroyerShip from '../images/destroyerShip.png';
import scoutShip from '../images/scoutShip.png';
import warShip from '../images/warShip.png';
import cruiserShip from '../images/cruiserShip.png';
import carrierShip from '../images/carrierShip.png';
import stealthShip from '../images/stealthShip.png';

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
