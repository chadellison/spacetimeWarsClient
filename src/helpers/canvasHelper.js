import {handleLocation, distanceTraveled, handleAngle} from './gameLogic.js';
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
  player.angle = handleAngle(player, ANAIMATION_FRAME_RATE)
  const distance = distanceTraveled(player, ANAIMATION_FRAME_RATE)
  player.location = handleLocation(player, distance);
};
