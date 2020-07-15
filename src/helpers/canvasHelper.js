import {findColor} from '../helpers/colorHelpers.js';
import {round} from '../helpers/mathHelpers.js';

export const drawShip = (context, player, ship, warpSpeed) => {
  handleDirection(context, ship, player.location, player.angle)
  if (player.accelerate) {
    if (player.effects[9]) {
      renderAnimation(context, warpSpeed, player.effects[9].animation, player.location)
    } else {
      handleAcceleration(context, player, ship);
    }
  }

  context.restore();
}

export const renderWeapon = (context, weapon, image) => {
  if (weapon.animation) {
    handleAnimatedWeapon(context, weapon, image);
  } else {
    handleDirection(context, image, weapon.location, weapon.trajectory)
  }
  context.restore();
}

export const handleAnimatedWeapon = (context, weapon, spriteImage) => {
  const {x, y} = weapon.location;
  context.save();
  const cx = round(x + 0.5 * weapon.width);
  const cy = round(y + 0.5 * weapon.height);

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * weapon.trajectory);
  context.translate(-cx, -cy);
  renderAnimation(context, spriteImage, weapon.animation, weapon.location);
}

export const handleDirection = (context, image, location, trajectory) => {
  const {x, y} = location;
  context.save();
  const cx = round(x + 0.5 * image.width);
  const cy = round(y + 0.5 * image.height);

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * trajectory);
  context.translate(-cx, -cy);
  context.drawImage(image, x, y);
}

const handleAcceleration = (context, player, ship) => {
  context.beginPath();
  const halfShipHeight = round(ship.height / 2);
  context.moveTo(player.location.x - 8, player.location.y + 4 + halfShipHeight);
  context.lineTo(player.location.x - 8, player.location.y - 2 + halfShipHeight);
  context.lineTo(player.location.x, player.location.y - 4 + halfShipHeight);
  context.lineTo(player.location.x, player.location.y + 5 + halfShipHeight);

  let grd = context.createLinearGradient(
    player.location.x - 8,
    round(player.location.y - 5 + halfShipHeight),
    player.location.x,
    round(player.location.y + 6 + halfShipHeight)
  );
  grd.addColorStop(0, "#5c93e6");
  grd.addColorStop(1, "#f0f6ff");

  context.stroke();
  context.fillStyle = grd;
  context.fill();
}

export const shouldRenderShip = (player, index) => {
  return (player.active) && (!player.effects[5] || (player.index === index));
}

export const handleInvisibleFilter = (context, player, index) => {
  if (player.effects[5] && player.index === index) {
    context.filter = 'opacity(0.5)';
  } else {
    context.filter = 'none';
  }
}

export const renderAnimation = (context, spriteImage, animation, location) => {
  context.drawImage(
    spriteImage,
    animation.coordinates.x,
    animation.coordinates.y,
    animation.width,
    animation.height,
    location.x + animation.xOffset,
    location.y + animation.yOffset,
    animation.renderWidth,
    animation.renderHeight
  )
}

export const renderPlayerData = (gameBuff, context, player, showShip) => {
  if (!gameBuff.color) {
    if (showShip && player.type === 'human') {
      context.font = "12px Arial";
      context.fillStyle = findColor(player.hitpoints, player.maxHitpoints);
      renderHealthBar(context, player);
      context.fillText(player.name, player.location.x + 25, player.location.y + 110)
    } else if (player.explode && !player.explodeAnimation.complete) {
      context.fillStyle = "#ab8432";
      context.font = "12px Arial";
      context.fillText(`+ ${round(player.score * 0.01 + 100)}`, player.location.x + 75, player.location.y)
    }
  }
};

const renderHealthBar = (context, player) => {
  context.beginPath();
  context.fillRect(player.location.x, player.location.y + 90, round((player.hitpoints * 100) / player.maxHitpoints), 4);
}
