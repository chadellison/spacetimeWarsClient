import { GAME_EFFECTS, SPRITE_IMAGES } from '../constants/effects.js';
import {
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { motherships, SHIPS, SUPPLY_SHIP } from '../constants/ships.js';
import { ABILITY_WEAPONS, EXPLOSION_ANIMATIONS, WEAPONS } from '../constants/weapons.js';

const loadCanvasImageAssets = () => {
  const result = [SUPPLY_SHIP.image];
  SHIPS.forEach(ship => {
    result.push(ship.image)
    result.push(ship.blueImage)
  });

  WEAPONS.concat(ABILITY_WEAPONS).forEach(weapon => result.push(weapon.animation ? weapon.animation.spriteImage : weapon.image));
  EXPLOSION_ANIMATIONS.forEach(weaponAnimation => result.push(weaponAnimation.spriteImage));
  GAME_EFFECTS.filter(effect => effect.animation).forEach(effect => result.push(SPRITE_IMAGES[effect.animation.spriteIndex]));
  GAME_ANIMATIONS.forEach(animation => result.push(animation.spriteImage));
  motherships.forEach(mothership => result.push(mothership.animation.spriteImage));
  return result;
}

const IMAGE_SOURCES = loadCanvasImageAssets();

const imageAssets = () => {
  return IMAGE_SOURCES.map((imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    return img;
  });
}

export const CANVAS_IMAGE_ASSETS = imageAssets();