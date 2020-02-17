import {handleLocation, distanceTraveled} from './gameLogic.js';
import {ANAIMATION_FRAME_RATE} from '../constants/settings.js';

export const drawShip = (ctx, player, fighterShip) => {
  const {x, y} = player.location;
  ctx.save();
  const cx = x + 0.5 * fighterShip.width;
  const cy = y + 0.5 * fighterShip.height;

  ctx.translate(cx, cy);
  ctx.rotate((Math.PI / 180) * player.angle);
  ctx.translate(-cx, -cy);

  ctx.drawImage(fighterShip, x, y)
  ctx.restore()
}

export const animatePlayer = (player) => {
  let angle = player.angle
  if (player.lastEvent === 'left') {
    angle -= 3;
    player.angle = angle < 0 ? angle + 360 : angle
  }
  if (player.lastEvent === 'right') {
    angle += 3;
    player.angle = angle > 360 ? angle - 360 : angle
  }

  // const currentVelocity = player.isAccelerating ? player.velocity + 3 : player.velocity;
  const distance = distanceTraveled(ANAIMATION_FRAME_RATE, player)
  player.location = handleLocation(player, distance);
};
