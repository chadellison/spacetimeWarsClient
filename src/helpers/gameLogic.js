import {VELOCITY, SQUARE_DISTANCE, START_LOCATION} from '../constants/settings.js';

export const handleDirection = (player) => {
  if (player.direction === 'left') {
    player.location.x -= VELOCITY;
  }
  if (player.direction === 'right') {
    player.location.x += VELOCITY;
  }
  if (player.direction === 'up') {
    player.location.y -= VELOCITY;
  }
  if (player.direction === 'down') {
    player.location.y += VELOCITY;
  }
}

export const handleMouthOpenAngle = (player) => {
  if (player.mouthOpenValue <= 0) {
    player.mouthPosition = 1;
  } else if (player.mouthOpenValue >= 40) {
    player.mouthPosition = -1;
  }

  player.mouthOpenValue += (8 * player.mouthPosition);
}

export const handleWrap = (player, width, height) => {
  if (player.location.x >= width) {
    player.location.x = 1;
  }

  if (player.location.x <= 0) {
    player.location.x = width;
  }

  if (player.location.y >= height) {
    player.location.y = 1;
  }

  if (player.location.y <= 0) {
    player.location.y = height;
  }
}

export const findCollisionCoordinates = (player) => {
  const {x, y} = player.location;
  let xRadius = x - 20
  let yRadius = y - 20;

  while (xRadius % SQUARE_DISTANCE !== 0 ) {
    xRadius += 1
  };

  while (yRadius % SQUARE_DISTANCE !== 0 ) {
    yRadius += 1
  };
  return [xRadius, yRadius];
}

export const createPlayer = (playerId) => {
  return {
    id: playerId,
    name: 'joe bob',
    score: 0,
    direction: 'right',
    location: START_LOCATION,
    mouthOpenValue: 40,
    mouthPosition: -1,
  }
}
