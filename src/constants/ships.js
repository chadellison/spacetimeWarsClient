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
import nuclearExplosionIcon from '../images/nuclearExplosionIcon.png';
import warpSpeedIcon from '../images/warpSpeedIcon.png';
import mineIcon from '../images/mineIcon.png';
import stunGunIcon from '../images/stunGunIcon.png';
import invulnerabilityIcon from '../images/invulnerabilityIcon.png';

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
      description: 'Stuns an enemy ship dealing 200 bonus damage (45s cooldown).',
      cooldown: 45000,
      lastUsed: 0,
      image: stunGunIcon,
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
      description: 'Renders your ship impervious to attacks for seven seconds (60s cooldown).',
      cooldown: 60000,
      lastUsed: 0,
      image: invulnerabilityIcon,
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
      description: 'Drops mines invisible to enemy ships that deal 600 bonus damage when a ship lands on the mine (50s cooldown).',
      cooldown: 50000,
      lastUsed: 0,
      image: mineIcon,
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
      description: 'Allows the ship to travel extremely fast (+4) for eight seconds (45s cooldown).',
      cooldown: 45000,
      lastUsed: 0,
      image: warpSpeedIcon,
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
      description: 'Deploys a massive blast dealing 500 bonus damage to every opponent ship (3 minute cooldown).',
      cooldown: 180000,
      lastUsed: 0,
      image: nuclearExplosionIcon,
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
      description: 'Renders ship invisible for ten seconds (60s cooldown).',
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
