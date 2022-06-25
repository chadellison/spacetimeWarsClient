import {findColor} from '../helpers/colorHelpers.js';
import {round} from '../helpers/mathHelpers.js';
import {isInvisable} from '../helpers/gameLogic.js';
import { GAME_ANIMATIONS } from '../constants/settings.js';
import {BOMBERS, SHIPS} from '../constants/ships.js';

export const drawShip = (context, player, ship, thruster) => {
  handleDirection(context, ship, player.location, player.angle)
  if (player.accelerate) {
    const thrusterAnimation = player.effects[9]?.animation || GAME_ANIMATIONS[3]
    renderThruster(context, thruster, player, thrusterAnimation);
  }

  context.restore();
}

const renderThruster = (context, thruster, player, animation) => {
  const ship = player.type === 'bomber' ? BOMBERS[player.index] : SHIPS[player.shipIndex]
  const xOffset = player.location.x - ship.shipCenter.x - (animation.renderWidth / 2) + ship.thrusterOffset.x + animation.xOffset;
  const yOffset = player.location.y + ship.shipCenter.y - (animation.renderHeight / 2) + ship.thrusterOffset.y + animation.yOffset;
  context.drawImage(
    thruster,
    animation.coordinates.x,
    animation.coordinates.y,
    animation.width,
    animation.height,
    xOffset,
    yOffset,
    animation.renderWidth,
    animation.renderHeight
  )
}

export const renderWeapon = (context, weapon, image) => {
  if (weapon.animation) {
    handleAnimatedWeapon(context, weapon, image);
  } else {
    handleDirection(context, image, weapon.location, weapon.trajectory)
  }
  context.restore();
}

const handleAnimatedWeapon = (context, weapon, spriteImage) => {
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

export const shouldRenderShip = (player, index) => {
  return (player.active) && (!isInvisable(player.effects) || (player.index === index));
}

export const handleInvisibleFilter = (context, player, index) => {
  if (isInvisable(player.effects) && player.index === index) {
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
    if (showShip) {
      context.font = "12px Arial";
      context.fillStyle = findColor(player.hitpoints, player.maxHitpoints);
      renderHealthBar(context, player);
      context.fillText(player.name, player.location.x + 25, player.location.y + 110)
    } else if (!player.active && !player.explodeAnimation.complete) {
      context.fillStyle = "#ab8432";
      context.font = "12px Arial";
      context.fillText(`+ ${round(player.score * 0.01 + 50)}`, player.location.x + 75, player.location.y)
    }
  }
};

export const renderMotherShipData = (gameBuff, context, ship) => {
  if (!gameBuff.color) {
    context.font = "12px Arial";
    context.fillStyle = findColor(ship.hitpoints, ship.maxHitpoints);
    context.beginPath();
    context.fillRect(ship.location.x + 15, ship.location.y + 90, round((ship.hitpoints * 190) / ship.maxHitpoints), 4);
  }
};

const renderHealthBar = (context, player) => {
  context.beginPath();
  context.fillRect(player.location.x + 15, player.location.y + 90, round((player.hitpoints * 80) / player.maxHitpoints), 4);
}
