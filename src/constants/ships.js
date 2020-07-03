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
import stealthMode from '../images/stealthMode.png';

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
    ability: {
      description: 'Stun Gun: Stuns an enemy ship dealing 200 bonus damage. (Can be used once every 45 seconds).',
      cooldown: 45000,
      lastUsed: 0,
      image: stealthMode,
    }
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
    absorbImage: hunterShipAbsorb,
    ability: {
      description: 'Invulnerable: Renders your ship impervious to attacks for seven seconds. (Can be used once every 60 seconds).',
      cooldown: 60000,
      lastUsed: 0,
      image: stealthMode,
    }
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
    ability: {
      description: 'Space Mines: Drops mines invisible to enemy ships that deal 600 bonus damage when a ship lands on the mine. (Can be used once every 50 seconds).',
      cooldown: 50000,
      lastUsed: 0,
      image: stealthMode,
    }
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
    absorbImage: cruiserShipAbsorb,
    ability: {
      description: 'Warp Speed: allows the ship to travel extremely fast (+4) for eight seconds. (Can be used once every 45 seconds).',
      cooldown: 45000,
      lastUsed: 0,
      image: stealthMode,
    }
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
    absorbImage: carrierShipAbsorb,
    ability: {
      description: 'Nuclear blast: Deploys a massive blast dealing 500 bonus damage to every opponent ship. (Can be used once every three minutes).',
      cooldown: 180000,
      lastUsed: 0,
      image: stealthMode,
    }
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
    ability: {
      description: 'Stealth: Renders ship invisible for ten seconds. (Can be used once every 60 seconds).',
      cooldown: 60000,
      lastUsed: 0,
      image: stealthMode,
    }
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
