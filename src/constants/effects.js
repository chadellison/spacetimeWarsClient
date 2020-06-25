import stunAnimation from '../images/stunAnimation.png'
import poisonAnimation from '../images/poisonAnimation.png'
import armorBoost from '../images/armorBoost.png'

export const GAME_EFFECTS = [
  {
    id: 1,
    name: 'poison',
    duration: 4000,
    durationCount: 0,
    color: 'rgba(7, 151, 24, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: poisonAnimation,
      width: 176,
      height: 195,
      renderSize: 100,
      rowCount: 8,
      columnCount: 2,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 2,
    name: 'slow',
    duration: 9000,
    durationCount: 0,
    color: 'rgba(142, 194, 215, 0.54)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 3,
    name: 'gold steal',
    duration: 3000,
    durationCount: 0,
    color: 'rgba(151, 127, 7, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 4,
    name: 'stun',
    duration: 3000,
    durationCount: 0,
    color: 'rgba(3, 2, 29, 0.62)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 5,
    name: 'invisible',
    duration: 11000,
    durationCount: 0,
    color: 'rgba(151, 7, 7, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }

  },
  {
    id: 6,
    name: 'invulnerable',
    duration: 7000,
    durationCount: 0,
    color: 'rgba(144, 7, 151, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 7,
    name: 'heal',
    duration: 4000,
    durationCount: 0,
    color: 'rgba(19, 20, 22, 0.45)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: stunAnimation,
      width: 250,
      height: 223,
      renderSize: 100,
      rowCount: 4,
      columnCount: 3,
      rate: 1,
      startRate: 1
    }
  },
  {
    id: 8,
    name: 'armorBoost',
    duration: 15000,
    durationCount: 0,
    color: 'rgba(7, 33, 151, 0.37)',
    animation: {
      coordinates: {x: 0, y: 0},
      spriteImage: armorBoost,
      width: 100,
      height: 103,
      renderSize: 50,
      rowCount: 1,
      columnCount: 1,
      rate: 1,
      startRate: 1
    }
  }
]
