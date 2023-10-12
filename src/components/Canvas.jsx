import { createRef, useEffect, useState } from 'react';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EXPLODE_PLAYER_COLOR
} from '../constants/settings.js';
import { BOMBERS, SHIPS } from '../constants/ships.js';
import {
  IMAGES_ASSETS,
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

const CANVAS_REF = createRef();

const Canvas = ({ userId, currentPlayer, players, aiShips, motherships, animations, deployedWeapons, loading, setImageLoadCount }) => {
  const [state, setState] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    const newImages = {};

    IMAGES_ASSETS.forEach((imageData) => {
      const img = new Image();
      img.src = imageData.image;
      img.onload = handleImageLoad;
      img.onerror = (e) => handleImageError(e, img, imageData.image)
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

  function handleImageError(e, img, imgSrc) {
    console.error('Image loading error:', e);
    setTimeout(() => { img.src = imgSrc }, 3000);
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
  };

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

    Object.values(ship.effects).forEach((effect) => {
      if (effect.animation && effect.id !== 9) {
        const effectCoordinates = findCenterCoordinates(ship.location, startCenter, { width: effect.animation?.renderWidth || 0, height: effect.animation?.renderHeight || 0 });
        renderAnimation(context, images[effect.name], effect.animation, effectCoordinates);
      }
    });
  }

  const renderBackgroundAnimations = (context) => {
    animations.forEach((animation) => {
      if (animation.isBackground) {
        renderAnimation(context, images[animation.name], animation, animation.location);
      }
    });
  };

  const renderAnimations = (context) => {
    animations.forEach((animation) => {
      if (!animation.isBackground) {
        renderAnimation(context, images[animation.name], animation, animation.location);
      }
    });
  };

  const renderWeapons = (currentPlayer, context) => {
    deployedWeapons.forEach((weapon) => {
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
      handleShips(players, context, userId, currentPlayerIsExploding);
      renderWeapons(currentPlayer, context);
      renderAnimations(context);
    }
  };

  currentPlayer && !loading && renderCanvas();

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
