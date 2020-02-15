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
  if (player.lastEvent === 'up') {
    // const slope = Math.tan(player.angle * Math.PI / 180)
    console.log(player.angle, 'angle')
    // console.log(slope, 'slope')
    // distance = 10
    // const x = player.location.x + distance;
    // const y = player.location.y - (slope * distance);

    // const x = Math.round(Math.cos(player.angle * Math.PI / 180) * distance + player.location.x);
    // const y = Math.round(Math.sin(player.angle * Math.PI / 180) * distance + player.location.y);

    // local math_sin = math.sin
    // local math_cos = math.cos
    // const radians = Math.PI / 180

    // local function angle2Vec(startX, startY, angle, distance)
    const radians = player.angle * Math.PI / 180
    const x = player.location.x + Math.cos(radians) * distance
    const y = player.location.y + Math.sin(radians) * distance
    console.log(x, 'x')
    console.log(y, 'y')
    return {x: Math.round(x), y: Math.round(y)}
  } else {
    return player.location;
  }
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
