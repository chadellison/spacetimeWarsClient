import React from 'react';
import {
  drawShip,
  shouldRenderShip,
  renderPlayerData,
  renderAnimation,
  handleInvisibleFilter,
  renderWeapon,
} from '../helpers/canvasHelper.js';
import { findCenterCoordinates } from '../helpers/gameLogic';
import '../styles/styles.css';
import {round} from '../helpers/mathHelpers.js';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  GAME_ANIMATIONS,
} from '../constants/settings.js';
import {SHIPS, SUPPLY_SHIP, BOMBERS} from '../constants/ships.js';
import {WEAPONS, ABILITY_WEAPONS, EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {GAME_EFFECTS, SPRITE_IMAGES} from '../constants/effects.js';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
    const hunter = this.refs.hunter
    const hunterBlue = this.refs.hunterBlue
    const hunterAbsorb = this.refs.hunterAbsorb
    const destroyer = this.refs.destroyer
    const destroyerBlue = this.refs.destroyerBlue
    const destroyerAbsorb = this.refs.destroyerAbsorb
    const warrior = this.refs.warrior
    const warriorBlue = this.refs.warriorBlue
    const warriorAbsorb = this.refs.warriorAbsorb
    const cruiser = this.refs.cruiser
    const cruiserBlue = this.refs.cruiserBlue
    const cruiserAbsorb = this.refs.cruiserAbsorb
    const carrier = this.refs.carrier
    const carrierBlue = this.refs.carrierBlue
    const carrierAbsorb = this.refs.carrierAbsorb
    const stealth = this.refs.stealth
    const stealthBlue = this.refs.stealthBlue
    const stealthAbsorb = this.refs.stealthAbsorb

    const fireball = this.refs.fireball
    const missile = this.refs.missile
    const trifecta = this.refs.trifecta
    const poisonCannon = this.refs.poisonCannon
    const bomb = this.refs.bomb
    const laser = this.refs.laser
    const blueFire = this.refs.blueFire
    const plasmaCannon = this.refs.plasmaCannon
    const supplyShip = this.refs.supplyShip
    const shipExplosion = this.refs.shipExplosion
    const poison = this.refs.poison
    const slow = this.refs.slow
    const stun = this.refs.stun
    const invulnerable = this.refs.invulnerable
    const heal = this.refs.heal
    const armorBoost = this.refs.armorBoost
    const warpSpeed = this.refs.warpSpeed
    const thruster = this.refs.thruster
    const nuclearBlast = this.refs.nuclearBlast
    const stunGun = this.refs.stunGun
    const spaceMine = this.refs.spaceMine
    const meteorShower = this.refs.meteorShower
    const piercer = this.refs.piercer
    const damageBoost = this.refs.damageBoost
    const damageReduction = this.refs.damageReduction
    const armorReduction = this.refs.armorReduction
    const spaceMineExplosion = this.refs.spaceMineExplosion
    const nuclearExplosion = this.refs.nuclearExplosion
    const meteorExplosion = this.refs.meteorExplosion
    const electricField = this.refs.electricField
    const redMeteor = this.refs.redMeteor
    const levelUp = this.refs.levelUp
    const blink = this.refs.blink
    const teleport = this.refs.teleport

    this.setState({
      canvas,
      context,
      hunter: hunter,
      hunterBlue: hunterBlue,
      hunterAbsorb: hunterAbsorb,
      destroyer: destroyer,
      destroyerBlue: destroyerBlue,
      destroyerAbsorb: destroyerAbsorb,
      warrior: warrior,
      warriorBlue: warriorBlue,
      warriorAbsorb: warriorAbsorb,
      cruiser: cruiser,
      cruiserBlue: cruiserBlue,
      cruiserAbsorb: cruiserAbsorb,
      carrier: carrier,
      carrierBlue: carrierBlue,
      carrierAbsorb: carrierAbsorb,
      stealth: stealth,
      stealthBlue: stealthBlue,
      stealthAbsorb: stealthAbsorb,

      fireball: fireball,
      missile: missile,
      trifecta: trifecta,
      poisonCannon: poisonCannon,
      bomb: bomb,
      laser: laser,
      blueFire: blueFire,
      plasmaCannon: plasmaCannon,
      poison: poison,
      slow: slow,
      stun: stun,
      invulnerable,
      heal: heal,
      armorBoost: armorBoost,
      warpSpeed: warpSpeed,
      thruster,
      nuclearBlast: nuclearBlast,
      stunGun: stunGun,
      spaceMine: spaceMine,
      piercer: piercer,
      meteorShower: meteorShower,
      damageBoost: damageBoost,
      damageReduction: damageReduction,
      armorReduction: armorReduction,
      electricField: electricField,
      redMeteor: redMeteor,
      spaceMineExplosion: spaceMineExplosion,
      nuclearExplosion: nuclearExplosion,
      meteorExplosion: meteorExplosion,
      shipExplosion: shipExplosion,
      levelUp: levelUp,
      blink: blink,
      teleport: teleport,
      supplyShip: supplyShip,
      halfWindowWidth: round(window.innerWidth / 2),
      halfWindowHeight: round(window.innerHeight / 2)
    });
  }

  handleImage = (player) => {
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
    return this.state[imageReference];
  };

  handleScroll = (currentPlayer) => {
    if (currentPlayer && currentPlayer.location) {
      window.scrollTo(
        currentPlayer.location.x - this.state.halfWindowWidth,
        currentPlayer.location.y - this.state.halfWindowHeight
      )
    }
  }

  handleShips = (players, context, index, gameBuff) => {
    const { aiShips } = this.props
    players.concat(aiShips).forEach((player) => {
      const showShip = shouldRenderShip(player, index);
      if (player.active) {
        if (showShip) {

          handleInvisibleFilter(context, player, index);

          const thruster = player.effects[9] ? this.state.warpSpeed : this.state.thruster;
          drawShip(context, player, this.handleImage(player), thruster);
          const shipCenter = ['supplyShip', 'bomber'].includes(player.type) ? {x: 60, y: 30} : SHIPS[player.shipIndex].shipCenter;

          Object.values(player.effects).forEach((effect) => {
            if (effect.animation && effect.id !== 9) {
              const effectCoordinates = findCenterCoordinates(player.location, shipCenter, {width: effect.animation?.renderWidth || 0, height: effect.animation?.renderHeight || 0});
              renderAnimation(context, this.state[effect.name], effect.animation, effectCoordinates);
            }
          });
        }
      } else if (!player.explodeAnimation.complete) {
        renderAnimation(context, this.state.shipExplosion, player.explodeAnimation, player.location);
      };
      renderPlayerData(gameBuff, context, player, showShip)
    });
  }

  renderAnimations = (context) => {
    this.props.animations.forEach((animation) => {
      renderAnimation(context, this.state[animation.name], animation, animation.location);
    });
  }

  renderWeapons = (currentPlayer, context) => {
    this.props.deployedWeapons.forEach((weapon) => {
      if (!weapon.invisible || (currentPlayer && weapon.team === currentPlayer.team)) {
        renderWeapon(context, weapon, this.state[weapon.name])
      }
    });
  }

  renderCanvas = () => {
    const {gameBuff, index, players} = this.props;
    const currentPlayer = players[index]
    this.handleScroll(currentPlayer)

    const canvas = this.canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (gameBuff.color) {
        context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        context.fillStyle = gameBuff.color;
      }

      this.handleShips(players, context, index, gameBuff);
      this.renderWeapons(currentPlayer, context);
      this.renderAnimations(context);
    }
  }

  render() {
    this.renderCanvas();
    return (
      <div>
        <canvas
          className="canvas column"
          ref={this.canvasRef}
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
        />
        {SHIPS.map((ship, index) => {
          return (
            <img ref={ship.name}
              src={ship.image}
              className="hidden"
              alt={ship.name}
              key={`ship${index}`}
            />
          );
        })}
        {SHIPS.map((ship, index) => {
          return (
            <img ref={`${ship.name}Blue`}
              src={ship.blueImage}
              className="hidden"
              alt={`blue-${ship.name}`}
              key={`blueShip${index}`}
            />
          );
        })}
        {WEAPONS.map((weapon, index) => {
          return(
            <img ref={weapon.name}
              src={weapon.animation ? weapon.animation.spriteImage : weapon.image}
              className="hidden"
              alt={weapon.name}
              key={`weapon${index}`}
            />
          );
        })}
        {ABILITY_WEAPONS.map((weapon, index) => {
          return(
            <img ref={weapon.name}
              src={weapon.animation ? weapon.animation.spriteImage : weapon.image}
              className="hidden"
              alt={weapon.name}
              key={`abilityWeapon${index}`}
            />
          );
        })}
        {EXPLOSION_ANIMATIONS.map((weaponAnimation, index) => {
          return(
            <img ref={weaponAnimation.name}
              src={weaponAnimation.spriteImage}
              className="hidden"
              alt={weaponAnimation.name}
              key={`weaponAnimation${index}`}
            />
          );
        })}
        {GAME_EFFECTS.filter((effect) => effect.animation)
          .map((effect, index) => {
            return(
              <img ref={effect.name}
                src={SPRITE_IMAGES[effect.animation.spriteIndex]}
                className="hidden"
                alt={effect.name}
                key={`shipEffect${index}`}
              />
            );
          })}

        {GAME_ANIMATIONS.map((animation, index) => {
          return(
            <img ref={animation.name}
              src={animation.spriteImage}
              className="hidden"
              alt={animation.name}
              key={`gameAnimation${index}`}
            />
          );
        })}

        <img ref={SUPPLY_SHIP.name} src={SUPPLY_SHIP.image} className="hidden" alt={SUPPLY_SHIP.name} />
      </div>
    );
  };
}

export default Canvas
