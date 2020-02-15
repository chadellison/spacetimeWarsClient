import {
  VELOCITY,
  SQUARE_DISTANCE,
  SHIP_RADIUS,
  ANAIMATION_FRAME_RATE
} from '../constants/settings.js';

export const distanceTraveled = (elapsedTime, velocity) => {
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return Math.round(velocity * gameTime);
}

export const updatePlayer = (player, clockDifference) => {
  const currentTime = Date.now();
  const elapsedTime = currentTime - clockDifference - player.updatedAt;
  player.angle = handleAngle(player, elapsedTime);
  const distance = distanceTraveled(elapsedTime, player.velocity);
  player.location = handleLocation(player, distance);
  return player
}

export const handleLocation = (player, distance) => {
  const slope = Math.tan(player.angle * Math.PI / 180)
  console.log(slope, 'slope')
  const x = player.location.x + distance;
  const y = player.location.y - (slope * distance);
  // return {x: x, y: y}
  return player.location
}

export const handleAngle = (player, elapsedTime) => {
  switch (player.lastEvent) {
    case 'left':
      return player.angle - 0.3 * (elapsedTime / ANAIMATION_FRAME_RATE)
    case 'right':
      return player.angle + 0.3 * (elapsedTime / ANAIMATION_FRAME_RATE)
    default:
      return player.angle;
  };
}

export const handleWall = (player, width, height) => {
  if (player.location.x >= (width - SHIP_RADIUS)) {
    player.location.x = (width - SHIP_RADIUS);
  }

  if (player.location.x <= SHIP_RADIUS) {
    player.location.x = SHIP_RADIUS;
  }

  if (player.location.y >= (height - SHIP_RADIUS)) {
    player.location.y = (height - SHIP_RADIUS);
  }

  if (player.location.y <= SHIP_RADIUS) {
    player.location.y = SHIP_RADIUS;
  }
}

// export const findCollisionCoordinates = (player) => {
//   const {x, y} = player.location;
//   let xRadius = x - 20
//   let yRadius = y - 20;
//
//   while (xRadius % SQUARE_DISTANCE !== 0 ) {
//     xRadius += 1
//   };
//
//   while (yRadius % SQUARE_DISTANCE !== 0 ) {
//     yRadius += 1
//   };
//   return [xRadius, yRadius];
// }
