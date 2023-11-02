import { createRef, useEffect, useState } from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EXPLODE_PLAYER_COLOR
} from '../constants/settings.js';
import { BOMBERS, SHIPS } from '../constants/ships.js';
import {
  LOADED_IMAGES,
  drawShip,
  extractAssets,
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

const CANVAS_REF = createRef();

const Canvas = ({ userId, currentPlayer, players, aiShips, motherships, animations, deployedWeapons }) => {
  const [state, setState] = useState({});
  const [images, setImages] = useState({});
  const imageAssets = extractAssets(players.concat(aiShips).concat(motherships));
  const assetsToLoad = imageAssets.length > 0;
  
  useEffect(() => {
    const newImages = {};
    imageAssets.forEach(imageData => {
      const img = new Image();
      img.src = imageData.image;
      img.onload = () => handleImageLoad(imageData.name);
      img.onerror = (e) => handleImageError(e, img, imageData.image)
      newImages[imageData.name] = img;
    })
    
    setImages({ ...images, ...newImages });
  }, [assetsToLoad]);

  useEffect(() => {
    setState({
      halfWindowWidth: round(window.innerWidth / 2),
      halfWindowHeight: round(window.innerHeight / 2),
    })
  }, []);

  function handleImageLoad(imageName) {
    LOADED_IMAGES[imageName] = true;
  }

  function handleImageError(e, img, imgSrc) {
    console.error('Image loading error:', e);
    setTimeout(() => { img.src = imgSrc }, 1000);
  };

  const findImageReference = (player) => {
    if (player.type === 'supplyShip') {
      return 'supplyShip';
    } else if (player.type === 'bomber') {
      return player.team === 'blue' ? BOMBERS[player.index].name + 'Blue' : BOMBERS[player.index].name;
    } else {
      return player.team === 'blue' ? SHIPS[player.shipIndex].name + 'Blue' : SHIPS[player.shipIndex].name
    }
  };

  const handleImage = (player) => images[findImageReference(player)];

  const handleScroll = (currentPlayer) => {
    if (currentPlayer?.location) {
      window.scrollTo(
        currentPlayer.location.x - state.halfWindowWidth,
        currentPlayer.location.y - state.halfWindowHeight
      )
    }
  };

  const renderShips = (context, userId, currentPlayerIsExploding) => {
    players.concat(aiShips).filter(player => LOADED_IMAGES[findImageReference(player)]).forEach(player => {
      const showShip = shouldRenderShip(player, userId);
      if (player.active) {
        if (showShip) {
          handleInvisibleFilter(context, player, userId);
          const thruster = player.effects[9] ? images.warpSpeed : images.thruster;
          const thrusterLoaded = player.effects[9] ? LOADED_IMAGES.warpSpeed : LOADED_IMAGES.thruster;
          drawShip({ context, player, ship: handleImage(player), thruster, thrusterLoaded });

          renderEffects(context, player)
        }
      } else if (!player.explodeAnimation.complete && LOADED_IMAGES['shipExplosion']) {
        renderAnimation(context, images.shipExplosion, player.explodeAnimation, player.location);
      };
      renderPlayerData(context, player, showShip, currentPlayerIsExploding);
    });

    motherships.filter(ship => LOADED_IMAGES[ship.name]).forEach((ship) => {
      if (ship.active) {
        const mothership = ship.team === 'red' ? images.redMothership : images.blueMothership;
        renderAnimation(context, mothership, ship.animation, ship.location);
        renderEffects(context, ship)
        renderMotherShipData(context, ship, currentPlayerIsExploding);
      } else if (!ship.explodeAnimation.complete) {
        renderAnimation(context, images.shipExplosion, ship.explodeAnimation, ship.location);
      }
    });
  };

  const renderEffects = (context, ship) => {
    const startCenter = findStartCenter(ship);

    Object.values(ship.effects).filter(effect => LOADED_IMAGES[effect.name]).forEach((effect) => {
      if (effect.animation && effect.id !== 9) {
        const effectCoordinates = findCenterCoordinates(ship.location, startCenter, { width: effect.animation?.renderWidth || 0, height: effect.animation?.renderHeight || 0 });
        renderAnimation(context, images[effect.name], effect.animation, effectCoordinates);
      }
    });
  }

  const renderBackgroundAnimations = (context) => {
    animations.forEach(animation => {
      if (animation.isBackground && LOADED_IMAGES[animation.name]) {
        renderAnimation(context, images[animation.name], animation, animation.location);
      }
    });
  };

  const renderAnimations = (context) => {
    animations.forEach((animation) => {
      if (!animation.isBackground && LOADED_IMAGES[animation.name]) {
        renderAnimation(context, images[animation.name], animation, animation.location);
      }
    });
  };

  const renderWeapons = (currentPlayer, context) => {
    deployedWeapons.filter(weapon => LOADED_IMAGES[weapon.name]).forEach((weapon) => {
      if (!weapon.invisible || (currentPlayer && weapon.team === currentPlayer.team)) {
        renderWeapon(context, weapon, images[weapon.name])
      }
    });
  };

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

      renderBackgroundAnimations(context);
      renderShips(context, userId, currentPlayerIsExploding);
      renderWeapons(currentPlayer, context);
      renderAnimations(context);
    }
  };
  
  currentPlayer && renderCanvas();

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
};

export default Canvas;
