// items
import repairBots from '../images/repairGears.png';
import healthBoost from '../images/healthBoost.jpg';
import stealthMode from '../images/stealthMode.png';

export const ITEMS = [
  {
    id: 1,
    index: 0,
    price: 700,
    name: 'Health boost',
    image: healthBoost,
    lastUpdated: 0,
    description: 'Boosts hitpoints to %50 of max hitpoints when hitpoints drop below %25 (120 second cooldown)'
  },
  {
    id: 2,
    index: 1,
    price: 300,
    name: 'Repair bots',
    image: repairBots,
    lastUpdated: 0,
    description: 'Repairs 1% of total hitpoints every second'
  },
  {
    id: 3,
    index: 2,
    price: 500,
    name: 'Stealth Mode',
    image: stealthMode,
    lastUpdated: 0,
    description: 'Your enemies will not hear you comming. Your ship will make no sound when moving or firing.'
  }
];
