import { GAME_EFFECTS, SPRITE_IMAGES } from '../constants/effects.js';
import {
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { findColor } from './colorHelpers.js';
import { isInvisable } from './gameLogic.js';
import { round } from './mathHelpers.js';

import { BOMBERS, MOTHER_SHIPS, SHIPS, SUPPLY_SHIP } from '../constants/ships.js';
import { ABILITY_WEAPONS, WEAPONS } from '../constants/weapons.js';

const RENDER_FONT = '12px Arial';

const resolveImage = (item) => {
  if (item.image) {
    return item.image;
  } else if (item.spriteImage) {
    return item.spriteImage;
  } else if (item?.animation?.spriteImage) {
    return item.animation.spriteImage;
  }
}

export const IMAGES_ASSETS = SHIPS
  .concat(SHIPS.map(ship => ({ ...ship, name: `${ship.name}Blue`, image: ship.blueImage })))
  .concat(BOMBERS)
  .concat(BOMBERS.map(ship => ({ ...ship, name: `${ship.name}Blue`, image: ship.blueImage })))
  .concat(WEAPONS.map(item => ({ ...item, image: resolveImage(item) })))
  .concat(ABILITY_WEAPONS.map(item => ({ ...item, image: resolveImage(item) })))
  .concat(GAME_EFFECTS.filter((effect) => effect.animation).map(item => ({ ...item, image: SPRITE_IMAGES[item.animation.spriteIndex] })))
  .concat(GAME_ANIMATIONS.map(item => ({ ...item, image: resolveImage(item) })))
  .concat(MOTHER_SHIPS.map(item => ({ ...item, image: resolveImage(item) })))
  .concat(SUPPLY_SHIP);

export const drawShip = ({ context, player, ship, thruster, thrusterLoaded }) => {
  handleDirection(context, ship, player.location, player.angle);
  if (player.accelerate) {
    const thrusterAnimation = player.effects[9]?.animation || player.thrusterAnimation;
    thrusterLoaded && renderThruster(context, thruster, player, thrusterAnimation);
  }

  context.restore();
};

const renderThruster = (context, thruster, player, animation) => {
  const ship = player.type === 'bomber' ? BOMBERS[player.index] : SHIPS[player.shipIndex]
  const xOffset = player.location.x - ship.shipCenter.x - (animation.renderWidth / 2) + animation.xOffset;
  const yOffset = player.location.y + ship.shipCenter.y - (animation.renderHeight / 2) + animation.yOffset;

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
};

export const renderWeapon = (context, weapon, image) => {
  if (weapon.animation) {
    handleAnimatedWeapon(context, weapon, image);
  } else {
    handleDirection(context, image, weapon.location, weapon.trajectory)
  }
  context.restore();
}

const handleAnimatedWeapon = (context, weapon, spriteImage) => {
  const { x, y } = weapon.location;
  context.save();
  const cx = round(x + 0.5 * weapon.width);
  const cy = round(y + 0.5 * weapon.height);

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * weapon.trajectory);
  context.translate(-cx, -cy);
  console.log(weapon.name, '*******')
  renderAnimation(context, spriteImage, weapon.animation, weapon.location);
}

export const handleDirection = (context, image, location, trajectory) => {
  const { x, y } = location;
  context.save();
  const cx = round(x + 0.5 * image.width);
  const cy = round(y + 0.5 * image.height);

  context.translate(cx, cy);
  context.rotate((Math.PI / 180) * trajectory);
  context.translate(-cx, -cy);
  context.drawImage(image, x, y);
}

export const shouldRenderShip = (player, userId) => player.active && (!isInvisable(player.effects) || (player.userId === userId));

export const handleInvisibleFilter = (context, player, userId) => {
  if (isInvisable(player.effects) && player.userId === userId) {
    context.filter = 'opacity(0.5)';
  } else {
    context.filter = 'none';
  }
};

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
  );
};

export const renderPlayerData = (context, player, showShip, isExploading) => {
  if (!isExploading) {
    if (showShip) {
      context.font = RENDER_FONT;
      context.fillStyle = findColor(player.hitpoints, player.maxHitpoints);
      renderHealthBar(context, player);
      context.fillText(player.name, player.location.x + 25, player.location.y + 110)
    } else if (!player.active && !player.explodeAnimation.complete) {
      context.fillStyle = '#ab8432';
      context.font = RENDER_FONT;
      context.fillText(`+ ${round(player.maxHitpoints * 0.1)}`, player.location.x + 75, player.location.y)
    }
  }
};

export const renderMotherShipData = (context, ship, isExploading) => {
  if (!isExploading) {
    context.font = RENDER_FONT;
    context.fillStyle = findColor(ship.hitpoints, ship.maxHitpoints);
    context.beginPath();
    context.fillRect(ship.location.x + 15, ship.location.y + 90, round((ship.hitpoints * 190) / ship.maxHitpoints), 4);
  }
};

const renderHealthBar = (context, player) => {
  context.beginPath();
  context.fillRect(player.location.x + 15, player.location.y + 90, round((player.hitpoints * 80) / player.maxHitpoints), 4);
};
