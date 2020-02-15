import {
  VELOCITY,
  SQUARE_DISTANCE,
  PACMAN_RADIUS,
  ANAIMATION_FRAME_RATE
} from '../constants/settings.js';

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
};

export const distanceTraveled = (elapsedTime, velocity) => {
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return Math.round(velocity * gameTime);
}

export const updatePlayer = (player, clockDifference) => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - clockDifference - player.updatedAt;
  const distance = distanceTraveled(elapsedTime, player.velocity);
  player.location = handleLocation(player, distance);
  return player
}

export const handleLocation = (player, distance) => {
  let x;
  let y;
  switch (player.direction) {
    case 'up':
      y = player.location.y - distance;
      return {x: player.location.x, y: y };
    case 'left':
      x = player.location.x - distance;
      return {x: x, y: player.location.y};
    case 'right':
      x = player.location.x + distance;
      return {x: x, y: player.location.y};
    case 'down':
      y = player.location.y + distance;
      return {x: player.location.x, y: y};
    default:
      return player.location;
  };
}

export const handleMouthOpenAngle = (player) => {
  if (player.mouthOpenValue <= 0) {
    player.mouthPosition = 1;
  } else if (player.mouthOpenValue >= 40) {
    player.mouthPosition = -1;
  }

  player.mouthOpenValue += (8 * player.mouthPosition);
};

export const handleWall = (player, width, height) => {
  if (player.location.x >= (width - PACMAN_RADIUS)) {
    player.location.x = (width - PACMAN_RADIUS);
  }

  if (player.location.x <= PACMAN_RADIUS) {
    player.location.x = PACMAN_RADIUS;
  }

  if (player.location.y >= (height - PACMAN_RADIUS)) {
    player.location.y = (height - PACMAN_RADIUS);
  }

  if (player.location.y <= PACMAN_RADIUS) {
    player.location.y = PACMAN_RADIUS;
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
