import {
  SHIP_RADIUS,
  ANAIMATION_FRAME_RATE
} from '../constants/settings.js';

export const distanceTraveled = (player, elapsedTime, clockDifference) => {
  let currentVelocity = player.velocity;

  if (player.isAccelerating) {
    currentVelocity += 4;
  } else {
    const timeSinceLastAcceleration = Date.now() + clockDifference - player.lastAccelerationTime;
    const momentum = 5000 - timeSinceLastAcceleration;
    if (momentum > 0) {
      currentVelocity += (momentum / 1000);
    }
  }
  const gameTime = elapsedTime / ANAIMATION_FRAME_RATE;
  return Math.round(currentVelocity * gameTime);
}

export const updatePlayer = (player, elapsedTime, clockDifference) => {
  player.angle = handleAngle(player, elapsedTime);
  const distance = distanceTraveled(player, elapsedTime, clockDifference);
  player.location = handleLocation(player, distance);
  return player
}

export const findElapsedTime = (clockDifference, updatedAt) => {
  const currentTime = Date.now();
  return currentTime + clockDifference - updatedAt;
}

export const handleLocation = (player, distance) => {
  const trajectory = player.trajectory;
  const radians = trajectory * Math.PI / 180
  const x = Math.round(player.location.x + Math.cos(radians) * distance)
  const y = Math.round(player.location.y + Math.sin(radians) * distance)
  return {x: x, y: y}
}

export const handleAngle = (player, elapsedTime) => {
  switch (player.rotation) {
    case 'left':
      const angle = (player.angle - 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360;
      return angle < 0 ? 360 - angle : angle;
    case 'right':
      return (player.angle + 3 * (elapsedTime / ANAIMATION_FRAME_RATE)) % 360
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
