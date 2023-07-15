import { createRef, useEffect, useState } from 'react';
import { GAME_EFFECTS, SPRITE_IMAGES } from '../constants/effects.js';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  EXPLODE_PLAYER_COLOR,
  GAME_ANIMATIONS
} from '../constants/settings.js';
import { SHIPS, SUPPLY_SHIP, motherships } from '../constants/ships.js';
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

const REF_NAMES = SHIPS.map(ship => ship.name)
    .concat(SHIPS.map(ship => `${ship.name}Blue`))
    .concat(WEAPONS.map(item => item.name))
    .concat(ABILITY_WEAPONS.map(item => item.name))
    .concat(EXPLOSION_ANIMATIONS.map(item => item.name))
    .concat(GAME_EFFECTS.map(item => item.name))
    .concat(GAME_ANIMATIONS.map(item => item.name))
    .concat(motherships.map(item => item.name))
    .concat([SUPPLY_SHIP.name]);

const GAME_REFS = {}
REF_NAMES.forEach((refName) => GAME_REFS[refName] = createRef());
const CANVAS_REF = createRef();

const Canvas = ({ userId, currentPlayer, players, aiShips, motherships, animations, deployedWeapons }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    const currentRefs = {}
    Object.keys(GAME_REFS).forEach(refKey => {
      currentRefs[refKey] = GAME_REFS[refKey].current
    });

    setState({
      ...currentRefs,
      halfWindowWidth: round(window.innerWidth / 2),
      halfWindowHeight: round(window.innerHeight / 2),
    });
  }, []);

  const handleImage = (player) => {
    let imageReference = '';
    if (player.type === 'supplyShip') {
      imageReference = 'supplyShip';
    } else if (player.type === 'bomber') {
      imageReference = player.team === 'blue' ? player.shipName + 'Blue' : player.shipName;
    } else {
      imageReference = SHIPS[player.shipIndex].name
      if (player.team === 'blue') {
        imageReference += 'Blue'
      }
    }
    return state[imageReference];
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
          
          const thruster = player.effects[9] ? state.warpSpeed : state.thruster;
          drawShip(context, player, handleImage(player), thruster);
          renderEffects(context, player)
        }
      } else if (!player.explodeAnimation.complete) {
        renderAnimation(context, state.shipExplosion, player.explodeAnimation, player.location);
      };
      renderPlayerData(context, player, showShip, currentPlayerIsExploding);
    });

    motherships.forEach((ship) => {
      const mothership = ship.team === 'red' ? state.redMothership : state.blueMothership;
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
        renderAnimation(context, state[effect.name], effect.animation, effectCoordinates);
      }
    });
  }

  const renderAnimations = (context) => {
    animations.forEach((animation) => {
      renderAnimation(context, state[animation.name], animation, animation.location);
    });
  }

  const renderWeapons = (currentPlayer, context) => {
    deployedWeapons.forEach((weapon) => {
      if (!weapon.invisible || (currentPlayer && weapon.team === currentPlayer.team)) {
        renderWeapon(context, weapon, state[weapon.name])
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

  currentPlayer && renderCanvas();

  return (
    <div>
      <canvas
        className={'canvas column'}
        ref={CANVAS_REF}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      />

      {SHIPS.map((ship, index) => {
        return (
          <img ref={GAME_REFS[ship.name]}
            src={ship.image}
            className="hidden"
            alt={ship.name}
            key={`ship${index}`}
          />
        );
      })}
      {SHIPS.map((ship, index) => {
        return (
          <img ref={GAME_REFS[`${ship.name}Blue`]}
            src={ship.blueImage}
            className="hidden"
            alt={`blue-${ship.name}`}
            key={`blueShip${index}`}
          />
        );
      })}
      {WEAPONS.map((weapon, index) => {
        return (
          <img ref={GAME_REFS[weapon.name]}
            src={weapon.animation ? weapon.animation.spriteImage : weapon.image}
            className="hidden"
            alt={weapon.name}
            key={`weapon${index}`}
          />
        );
      })}
      {ABILITY_WEAPONS.map((weapon, index) => {
        return (
          <img ref={GAME_REFS[weapon.name]}
            src={weapon.animation ? weapon.animation.spriteImage : weapon.image}
            className="hidden"
            alt={weapon.name}
            key={`abilityWeapon${index}`}
          />
        );
      })}
      {EXPLOSION_ANIMATIONS.map((weaponAnimation, index) => {
        return (
          <img ref={GAME_REFS[weaponAnimation.name]}
            src={weaponAnimation.spriteImage}
            className="hidden"
            alt={weaponAnimation.name}
            key={`weaponAnimation${index}`}
          />
        );
      })}
      {GAME_EFFECTS.filter((effect) => effect.animation)
        .map((effect, index) => {
          return (
            <img ref={GAME_REFS[effect.name]}
              src={SPRITE_IMAGES[effect.animation.spriteIndex]}
              className="hidden"
              alt={effect.name}
              key={`shipEffect${index}`}
            />
          );
        })}

      {GAME_ANIMATIONS.map((animation, index) => {
        return (
          <img ref={GAME_REFS[animation.name]}
            src={animation.spriteImage}
            className="hidden"
            alt={animation.name}
            key={`gameAnimation${index}`}
          />
        );
      })}

      {motherships.map((mothership, index) => {
        return <img ref={GAME_REFS[mothership.name]} src={mothership.animation.spriteImage} className="hidden" alt={mothership.name} key={`mothership${index}`} />
      })}

      <img ref={GAME_REFS[SUPPLY_SHIP.name]} src={SUPPLY_SHIP.image} className="hidden" alt={SUPPLY_SHIP.name} />
    </div>
  );
}

export default Canvas
