import {SPRITE_WIDTH} from '../constants/settings.js';
import {findColor} from '../helpers/colorHelpers.js';

export const drawShip = (context, player, ship) => {
  handleDirection(context, ship, player.location, player.angle)
  if (player.accelerate) {
    handleAcceleration(context, player, ship);
  }

  context.restore();
}

export const handleDirection = (context, image, location, trajectory) => {
  const {x, y} = location;
  context.save();
  const cx = x + 0.5 * image.width;
  const cy = y + 0.5 * image.height;

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * trajectory);
  context.translate(-cx, -cy);
  context.drawImage(image, x, y);
}

const handleAcceleration = (context, player, ship) => {
  context.beginPath();
  context.moveTo(player.location.x - 8, player.location.y + 4 + ship.height / 2);
  context.lineTo(player.location.x - 8, player.location.y - 2 + ship.height / 2);
  context.lineTo(player.location.x, player.location.y - 4 + ship.height / 2);
  context.lineTo(player.location.x, player.location.y + 5 + ship.height / 2);

  let grd = context.createLinearGradient(
    player.location.x - 8,
    player.location.y - 5 + ship.height / 2,
    player.location.x,
    player.location.y + 6 + ship.height / 2
  );
  grd.addColorStop(0, "#5c93e6");
  grd.addColorStop(1, "#f0f6ff");

  context.stroke();
  context.fillStyle = grd;
  context.fill();
}

export const shouldRenderShip = (player, currentPlayerId) => {
  return (!player.explode) && (!player.effects[5] || player.id === currentPlayerId);
}

export const renderExplosion = (gameBuff, context, explosion, player) => {
  context.drawImage(
    explosion,
    player.explodeAnimation.x,
    player.explodeAnimation.y,
    SPRITE_WIDTH,
    SPRITE_WIDTH,
    player.location.x,
    player.location.y,
    200,
    200
  )
};

export const renderText = (gameBuff, context, player, showShip) => {
  if (!gameBuff.color) {
    if (showShip && player.type !== 'ai') {
      context.font = "12px Arial";
      context.fillStyle = findColor(player.hitpoints, player.maxHitpoints);
      renderHealthBar(context, player);
      context.fillText(player.name, player.location.x + 25, player.location.y + 110)

    } else if (!showShip) {
      context.fillStyle = "#ab8432";
      context.font = "12px Arial";
      context.fillText(`+ ${Math.round(player.score * 0.01 + 100)}`, player.location.x + 75, player.location.y)
    }
  }
};

const renderHealthBar = (context, player) => {
  context.beginPath();
  context.fillRect(player.location.x, player.location.y + 90, Math.round((player.hitpoints * 100) / player.maxHitpoints), 4);
}
