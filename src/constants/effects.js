import poison from '../images/plasmaCannon.png';
import heal from '../images/healthBoost.jpg';
import armorBoost from '../images/armorBoost.png';
import stun from '../images/stun.png';
import slow from '../images/blueFire.png';

export const GAME_EFFECTS = [
  {
    id: 1,
    name: 'poison',
    duration: 4000,
    durationCount: 0,
    image: poison,
    color: 'rgba(7, 151, 24, 0.37)'
  },
  {
    id: 2,
    name: 'slow',
    duration: 9000,
    durationCount: 0,
    image: slow,
    color: 'rgba(142, 194, 215, 0.54)'
  },
  {
    id: 3,
    name: 'gold steal',
    duration: 3000,
    durationCount: 0,
    image: '',
    color: 'rgba(151, 127, 7, 0.37)'
  },
  {
    id: 4,
    name: 'stun',
    duration: 3000,
    durationCount: 0,
    image: stun,
    color: 'rgba(3, 2, 29, 0.62)'
  },
  {
    id: 5,
    name: 'invisible',
    duration: 11000,
    durationCount: 0,
    image: '',
    color: 'rgba(151, 7, 7, 0.37)'

  },
  {
    id: 6,
    name: 'invulnerable',
    duration: 7000,
    durationCount: 0,
    image: '',
    color: 'rgba(144, 7, 151, 0.37)'
  },
  {
    id: 7,
    name: 'heal',
    duration: 4000,
    durationCount: 0,
    image: heal,
    color: 'rgba(19, 20, 22, 0.45)'
  },
  {
    id: 8,
    name: 'armorBoost',
    duration: 15000,
    durationCount: 0,
    image: armorBoost,
    color: 'rgba(7, 33, 151, 0.37)'
  }
]
