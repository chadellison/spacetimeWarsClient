// items
import repairBots from '../images/repairGears.png';
import healthBoost from '../images/healthBoost.jpg';
import stealthMode from '../images/stealthMode.png';
import absorbDamage from '../images/absorbDamage.png';
import armorBoost from '../images/armorBoost.png';
import stun from '../images/stun.png';

export const ITEMS = [
  {
    id: 1,
    index: 0,
    price: 800,
    name: 'Health boost',
    image: healthBoost,
    cooldown: 120000,
    durationCount: 120000,
    description: 'Boosts hitpoints to %50 of max hitpoints when hitpoints drop below %25 (120 second cooldown)'
  },
  {
    id: 2,
    index: 1,
    price: 300,
    name: 'Repair bots',
    image: repairBots,
    cooldown: 1000,
    durationCount: 1000,
    description: 'Repairs 1% of total hitpoints every second'
  },
  {
    id: 3,
    index: 2,
    price: 650,
    name: 'Stealth Mode',
    image: stealthMode,
    cooldown: 120000,
    durationCount: 120000,
    description: 'Renders your ship invisible for six seconds to other players when your hitpoints drop below 25% (120 second cooldown)'
  },
  {
    id: 4,
    index: 3,
    price: 725,
    name: 'Absorb damage',
    image: absorbDamage,
    cooldown: 10000,
    durationCount: 10000,
    description: 'Provieds a shield that completely absorbs one hit -- negating all damage/effects from it-- every 10 seconds.'
  },
  {
    id: 5,
    index: 4,
    price: 750,
    name: 'Armor Boost',
    image: armorBoost,
    cooldown: 20000,
    durationCount: 15000,
    description: 'Adds 4 armor to player for 15 seconds when hitpoints drop below 33%. 20 second cooldown.'
  },
  {
    id: 6,
    index: 5,
    price: 600,
    name: 'Stun',
    image: stun,
    cooldown: 0,
    durationCount: 0,
    description: 'Provieds your weapon a 10% chance to stun your opponent for two seconds'
  }
];
