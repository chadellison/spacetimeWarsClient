import { GAME_EFFECTS, SPRITE_IMAGES } from '../constants/effects.js';
import {
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { findColor } from './colorHelpers.js';
import { isInvisable } from './gameLogic.js';
import { round } from './mathHelpers.js';

import { ABILITIES } from '../constants/abilities.js';
import { BOMBERS, SHIPS, SUPPLY_SHIP } from '../constants/ships.js';
import { ABILITY_WEAPONS, WEAPONS } from '../constants/weapons.js';
import { CACHE } from './cacheHelpers.js';

const RENDER_FONT = '12px Arial';
export const LOADED_IMAGES = {};

const resolveImage = (item) => {
  if (item.image) {
    return item.image;
  } else if (item.spriteImage) {
    return item.spriteImage;
  } else if (item?.animation?.spriteImage) {
    return item.animation.spriteImage;
  }
};

export const INITIAL_ASSETS = GAME_ANIMATIONS.map(item => ({ name: item.name, image: resolveImage(item) }));

const resolveShip = (ship) => {
  if (ship.type === 'supplyShip') {
    return { resolvedShip: ship, asset: { name: SUPPLY_SHIP.name, image: SUPPLY_SHIP.image }};
  } else if (ship.type === 'bomber') {
    if ([undefined, null].includes(ship.index)) {
      return { resolvedShip: ship, asset: { name: ship.name, image: resolveImage(ship) } }
    } else {
      return { resolvedShip: BOMBERS[ship.index], asset: ship.team === 'blue' ? { name: `${BOMBERS[ship.index].name}Blue`, image: BOMBERS[ship.index].blueImage } : { name: BOMBERS[ship.index].name, image: BOMBERS[ship.index].image } }
    }
  } else {
    return { resolvedShip: SHIPS[ship.shipIndex], asset: ship.team === 'blue' ? { name: `${SHIPS[ship.shipIndex].name}Blue`, image: SHIPS[ship.shipIndex].blueImage } : { name: SHIPS[ship.shipIndex].name, image: SHIPS[ship.shipIndex].image } };
  }
};

const handleAsset = (assets, asset) => {
  if (!LOADED_IMAGES[asset.name]) {
    assets.push(asset)
  }
  return assets;
};

const handleEffectAsset = (assets, effectIndex) => {
  if (![undefined, null].includes(effectIndex)) {
    const effect = GAME_EFFECTS[effectIndex];
    if (effect.animation && !LOADED_IMAGES[effect.name]) {
      assets.push({ name: effect.name, image: SPRITE_IMAGES[effect.animation.spriteIndex] })
    }
  }
  return assets;
}

export const extractAssets = (ships) => {
  let assets = [];
  if (!CACHE['initialAssets']) {
    assets = INITIAL_ASSETS;
    CACHE['initialAssets'] = true;
  }

  ships.forEach(ship => {
    const { resolvedShip, asset } = resolveShip(ship);
    const cacheKey = ship.userId || asset.name;
    
    if (!CACHE[cacheKey]) {
      CACHE[cacheKey] = true;

      assets = handleAsset(assets, asset);

      if (resolvedShip.type === 'supplyShip') {
        assets = handleEffectAsset(assets, resolvedShip.buffIndex);
      } else {
        const weapon = WEAPONS[ship.weaponIndex];
        assets = handleAsset(assets, { name: weapon.name, image: resolveImage(weapon) });
        assets = handleEffectAsset(assets, weapon.effectIndex);
      }
      
      Object.values(resolvedShip.abilities || []).forEach(abilityIndex => {
        const ability = ABILITIES[abilityIndex];
        
        if (![undefined, null].includes(ability.weaponIndex)) {
          const abilityWeapon = ABILITY_WEAPONS[ability.weaponIndex];
          assets = handleAsset(assets, { name: abilityWeapon.name,  image: resolveImage(abilityWeapon) });
          assets = handleEffectAsset(assets, abilityWeapon.effectIndex);
        } else {
          assets = handleEffectAsset(assets, ability.effectIndex);          
        }
      })

      Object.values(ship.items).forEach(item => {
        assets = handleEffectAsset(assets, item.effectIndex);
      })
    }
  })

  return assets;
};

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
