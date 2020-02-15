import {
  SQUARE_DISTANCE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  VELOCITY
} from '../constants/settings.js';

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
  switch (player.lastEvent) {
    case 'left':
      player.angle -= 3;
      break;
    case 'right':
      player.angle += 3;
      break;
    case 'up':
      // const slope = Math.tan(player.angle * Math.PI / 180)
      // player.location.y -= (slope * VELOCITY);
      // player.location.x += VELOCITY;
      // break;
    default:
      break;
  }
};
