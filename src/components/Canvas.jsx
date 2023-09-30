import { createRef, useEffect, useState } from 'react';
import { GAME_EFFECTS, SPRITE_IMAGES } from '../constants/effects.js';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EXPLODE_PLAYER_COLOR,
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { BOMBERS, SHIPS, SUPPLY_SHIP, motherships } from '../constants/ships.js';
import { ABILITY_WEAPONS, EXPLOSION_ANIMATIONS, WEAPONS } from '../constants/weapons.js';
import {
  drawShip,
  handleInvisibleFilter,
  renderAnimation,
  renderMotherShipData,
  renderPlayerData,
  renderWeapon,
  shouldRenderShip
} from '../helpers/canvasHelper.js';
import { findCenterCoordinates, findStartCenter } from '../helpers/gameLogic';
import { round } from '../helpers/mathHelpers.js';
import '../styles/styles.css';

const resolveImage = (item) => {
  if (item.image) {
    return item.image;
  } else if (item.spriteImage) {
    return item.spriteImage;
  } else if (item?.animation?.spriteImage) {
    return item.animation.spriteImage;
  }
}

const IMAGES = SHIPS
  .concat(SHIPS.map(ship => ({...ship, name: `${ship.name}Blue`})))
  .concat(BOMBERS)
  .concat(BOMBERS.map(ship => ({...ship, name: `${ship.name}Blue`})))
  .concat(WEAPONS.map(item => ({...item, image: resolveImage(item)})))
  .concat(ABILITY_WEAPONS.map(item => ({...item, image: resolveImage(item)})))
  .concat(EXPLOSION_ANIMATIONS.map(item => ({...item, image: resolveImage(item)})))
  .concat(GAME_EFFECTS.filter((effect) => effect.animation).map(item => ({...item, image: SPRITE_IMAGES[item.animation.spriteIndex]})))
  .concat(GAME_ANIMATIONS.map(item => ({...item, image: resolveImage(item)})))
  .concat(motherships.map(item => ({...item, image: resolveImage(item)})))
  .concat(SUPPLY_SHIP);

const CANVAS_REF = createRef();
const ASSET_COUNT = IMAGES.length;

const Canvas = ({ userId, currentPlayer, players, aiShips, motherships, animations, deployedWeapons }) => {
  const [state, setState] = useState({});
  const [images, setImages] = useState({});
  const [imageLoadCount, setImageLoadCount] = useState(0);

  useEffect(() => {
    const newImages = {};

    IMAGES.forEach((imageData) => {
      const img = new Image();
      img.src = imageData.image;
      img.onload = handleImageLoad();
      newImages[imageData.name] = img;
    })

    setImages(newImages);
    setState({
      halfWindowWidth: round(window.innerWidth / 2),
      halfWindowHeight: round(window.innerHeight / 2),
    });
  }, []);

  function handleImageLoad() {
    setImageLoadCount((prevState) => (prevState + 1));
  }

  const handleImage = (player) => {
    let imageReference = '';
    if (player.type === 'supplyShip') {
      imageReference = 'supplyShip';
    } else if (player.type === 'bomber') {
      imageReference = player.team === 'blue' ? BOMBERS[player.index].name + 'Blue' : BOMBERS[player.index].name;
    } else {
      imageReference = player.team === 'blue' ? SHIPS[player.shipIndex].name + 'Blue' : SHIPS[player.shipIndex].name
    }
    return images[imageReference];
  };

  const handleScroll = (currentPlayer) => {
    if (currentPlayer?.location) {
      window.scrollTo(
        currentPlayer.location.x - state.halfWindowWidth,
        currentPlayer.location.y - state.halfWindowHeight
      )
    }
  }

  const handleShips = (players, context, userId, currentPlayerIsExploding) => {
    players.concat(aiShips).forEach((player) => {
      const showShip = shouldRenderShip(player, userId);
      if (player.active) {
        if (showShip) {

          handleInvisibleFilter(context, player, userId);
          
          const thruster = player.effects[9] ? images.warpSpeed : images.thruster;
    
          drawShip(context, player, handleImage(player), thruster);
          
          renderEffects(context, player)
        }
      } else if (!player.explodeAnimation.complete) {
        renderAnimation(context, images.shipExplosion, player.explodeAnimation, player.location);
      };
      renderPlayerData(context, player, showShip, currentPlayerIsExploding);
    });

    motherships.forEach((ship) => {
      const mothership = ship.team === 'red' ? images.redMothership : images.blueMothership;
      renderAnimation(context, mothership, ship.animation, ship.location);
      renderEffects(context, ship)
      renderMotherShipData(context, ship, currentPlayerIsExploding);
    });
  }

  const renderEffects = (context, ship) => {
    const startCenter = findStartCenter(ship);

    Object.values(ship.effects).forEach((effect) => {
      if (effect.animation && effect.id !== 9) {
        const effectCoordinates = findCenterCoordinates(ship.location, startCenter, { width: effect.animation?.renderWidth || 0, height: effect.animation?.renderHeight || 0 });
        renderAnimation(context, images[effect.name], effect.animation, effectCoordinates);
      }
    });
  }

  const renderAnimations = (context) => {
    animations.forEach((animation) => {
      renderAnimation(context, images[animation.name], animation, animation.location);
    });
  }

  const renderWeapons = (currentPlayer, context) => {
    deployedWeapons.forEach((weapon) => {
      if (!weapon.invisible || (currentPlayer && weapon.team === currentPlayer.team)) {
        renderWeapon(context, weapon, images[weapon.name])
      }
    });
  }

  const renderCanvas = () => {
    handleScroll(currentPlayer)

    const canvas = CANVAS_REF.current

    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      const currentPlayerIsExploding = currentPlayer && !currentPlayer.active && !currentPlayer.explodeAnimation.complete;
      if (currentPlayerIsExploding) {
        context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        context.fillStyle = EXPLODE_PLAYER_COLOR;
      }

      handleShips(players, context, userId, currentPlayerIsExploding);
      renderWeapons(currentPlayer, context);
      renderAnimations(context);
    }
  }

  currentPlayer && imageLoadCount === ASSET_COUNT && renderCanvas()

  return (
    <div>
      <canvas
        className={'canvas column'}
        ref={CANVAS_REF}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      />
    </div>
  );
}

export default Canvas
