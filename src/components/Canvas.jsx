import React from 'react';
import { gameSocket } from './gameSocket.js';
import {
  drawShip,
  shouldRenderShip,
  renderPlayerData,
  renderAnimation,
  handleInvisibleFilter,
  renderWeapon,
} from '../helpers/canvasHelper.js';
import {canAbsorbDamage} from '../helpers/itemHelpers.js';
import '../styles/styles.css';
import {round} from '../helpers/mathHelpers.js';
import {KEY_MAP} from '../constants/keyMap.js';
import { updateUserAction } from '../actions/userActions';
import { updateGameEventAction } from '../actions/gameEventActions';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  levelUp,
} from '../constants/settings.js';
import {SHIPS, SUPPLY_SHIP, RED_BOMBER, BLUE_BOMBER} from '../constants/ships.js';
import {WEAPONS, ABILITY_WEAPONS, EXPLOSION_ANIMATIONS} from '../constants/weapons.js';
import {GAME_EFFECTS} from '../constants/effects.js';
import {keyDownEvent, keyUpEventPayload, handleAiEvents} from '../helpers/sendEventHelpers.js';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.interval = setInterval(() => this.renderGame(), ANAIMATION_FRAME_RATE);

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
    const redBomber = this.refs.redBomber
    const blueBomber = this.refs.blueBomber
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
    const heal = this.refs.heal
    const armorBoost = this.refs.armorBoost
    const warpSpeed = this.refs.warpSpeed
    const nuclearBlast = this.refs.nuclearBlast
    const stunGun = this.refs.stunGun
    const spaceMine = this.refs.spaceMine
    const meteorShower = this.refs.meteorShower
    const piercer = this.refs.piercer
    const damageBoost = this.refs.damageBoost
    const damageReduction = this.refs.damageReduction
    const spaceMineExplosion = this.refs.spaceMineExplosion
    const nuclearExplosion = this.refs.nuclearExplosion
    const electricField = this.refs.electricField
    const levelUp = this.refs.levelUp

    this.setState({
      canvas: canvas,
      context: context,
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
      redBomber: redBomber,
      blueBomber: blueBomber,
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
      heal: heal,
      armorBoost: armorBoost,
      warpSpeed: warpSpeed,
      nuclearBlast: nuclearBlast,
      stunGun: stunGun,
      spaceMine: spaceMine,
      piercer: piercer,
      meteorShower: meteorShower,
      damageBoost: damageBoost,
      damageReduction: damageReduction,
      electricField: electricField,
      spaceMineExplosion: spaceMineExplosion,
      nuclearExplosion: nuclearExplosion,
      shipExplosion: shipExplosion,
      levelUp: levelUp,
      supplyShip: supplyShip,
      halfWindowWidth: round(window.innerWidth / 2),
      halfWindowHeight: round(window.innerHeight / 2)
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderGame = () => {
    updatedGameState = updateGameState = (
      this.state,
      this.updateState,
      this.handleGameEvent
    );
    this.setState(updatedGameState);
  }

  handleGameEvent = (eventPayload) => {
    let userEvents = {...this.props.gameEvent.userEvents};
    const id = Object.keys(userEvents).length
    const sentTime = Date.now();
    gameSocket.create({
      ...eventPayload,
      eventId: id,
      serverTime: sentTime + this.props.game.clockDifference
    });
    userEvents[id] = sentTime;
    let eventData = {...this.props.gameEvent}
    eventData.userEvents = userEvents
    this.props.updateGameEventAction(eventData);
  };

  handleKeyDown = (event) => {
    const {modal, players, user} = this.props;
    const {up, left, right, space, index} = user;

    if (!modal) {
      const pressedKey = KEY_MAP[event.keyCode];
      const currentPlayer = players[index];
      if (currentPlayer.active && !user[pressedKey]) {
        this.props.updateUserAction(pressedKey, true);
        // this.setState({[pressedKey]: true})
        keyDownEvent(pressedKey, this.props, this.handleGameEvent, this.updateState);
      }
    }
  };

  handleKeyUp = (event) => {
    const {modal, players, user} = this.props;
    const {up, left, right, space, index} = user;

    const currentPlayer = players[index]
    const unpressedKey = KEY_MAP[event.keyCode];
    if (currentPlayer && currentPlayer.active && !this.props.modal.display && this.props.user[unpressedKey]) {
      this.setState({[unpressedKey]: false});
      this.props.updateUserAction(unpressedKey, false);
      keyUpEventPayload(unpressedKey, this.props, this.handleGameEvent, this.updateState)
    };
  };

  handleImage = (player) => {
    let imageReference = '';
    if (player.type === 'supplyShip') {
      imageReference = 'supplyShip';
    } else if (player.type === 'bomber') {
        imageReference = player.team + 'Bomber'
    } else {
      imageReference = SHIPS[player.shipIndex].name
      if (canAbsorbDamage(player)) {
        imageReference += 'Absorb';
      } else if (player.team === 'blue') {
          imageReference += 'Blue'
      }
    }
    return this.state[imageReference];
  };

  componentDidUpdate() {
    const currentPlayer = this.props.players[this.props.index]
    if (currentPlayer && currentPlayer.location) {
      window.scrollTo(
        currentPlayer.location.x - this.state.halfWindowWidth,
        currentPlayer.location.y - this.state.halfWindowHeight
      )
    }
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (this.props.game.gameBuff.color) {
      context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      context.fillStyle = this.props.gameBuff.color;
    }

    this.props.players.concat(this.props.game.aiShips).forEach((player) => {
      // const {gameBuff, index} = this.props;
      const {index} = this.props.user;
      const {gameBuff} = this.props.game;
      const showShip = shouldRenderShip(player, index);
      if (player.active) {
        if (showShip) {
          handleInvisibleFilter(context, player, index);
          drawShip(context, player, this.handleImage(player), this.state.warpSpeed);
          Object.values(player.effects).forEach((effect) => {
            if (effect.animation && effect.id !== 9) {
              renderAnimation(context, this.state[effect.name], effect.animation, player.location);
            }
          });
        }
      } else if (!player.explodeAnimation.complete) {
        renderAnimation(context, this.state.shipExplosion, player.explodeAnimation, player.location);
      };
      renderPlayerData(gameBuff, context, player, showShip)
    });

    this.props.deployedWeapons.forEach((weapon) => {
      if (!weapon.invisible || (currentPlayer && weapon.team === currentPlayer.team)) {
        renderWeapon(context, weapon, this.state[weapon.name])
      }
    });

    this.props.game.animations.forEach((animation) => {
      renderAnimation(context, this.state[animation.name], animation, animation.location);
    });
  }

  render() {
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
        {SHIPS.map((ship, index) => {
          return (
            <img ref={`${ship.name}Absorb`}
              src={ship.absorbImage}
              className="hidden"
              alt={`${ship.name} Absorb`}
              key={`ship${index}Absorb`}
            />
          );
        })}
        {WEAPONS.map((weapon, index) => {
          return(
            <img ref={weapon.name}
              src={weapon.image}
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
        {GAME_EFFECTS.filter((effect, index) => effect.animation)
          .map((effect, index) => {
            return(
              <img ref={effect.name}
                src={effect.animation.spriteImage}
                className="hidden"
                alt={effect.name}
                key={`shipEffect${index}`}
              />
            );
          })}
        <img ref={SUPPLY_SHIP.name} src={SUPPLY_SHIP.image} className="hidden" alt={SUPPLY_SHIP.name} />
        <img ref={RED_BOMBER.name} src={RED_BOMBER.image} className="hidden" alt={RED_BOMBER.name} />
        <img ref={BLUE_BOMBER.name} src={BLUE_BOMBER.image} className="hidden" alt={BLUE_BOMBER.name} />
        <img ref="levelUp" src={levelUp.spriteImage} className="hidden" alt="level up" />
      </div>
    );
  };
}

const mapStateToProps = ({user, players, game, deployedWeapons, modal}) => {
  return {user, players, game, deployedWeapons, modal};
}

const mapDispatchToProps = dispatch => {
  return {
    updateUserAction,
    updateGameEventAction,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
