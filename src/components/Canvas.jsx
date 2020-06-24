import React from 'react';
import {
  drawShip,
  handleDirection,
  shouldRenderShip,
  renderExplosion,
  renderPlayerData,
  renderAnimation
} from '../helpers/canvasHelper.js';
import {canAbsorbDamage} from '../helpers/itemHelpers.js';
import '../styles/styles.css';
import explodeAnimation from '../images/explosion.png';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '../constants/settings.js';
import {SHIPS, SUPPLY_SHIP} from '../constants/ships.js';
import {WEAPONS} from '../constants/weapons.js';
import {GAME_EFFECTS} from '../constants/effects.js';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
    const hunterShip = this.refs.hunterShip
    const hunterShipAbsorb = this.refs.hunterShipAbsorb
    const destroyerShip = this.refs.destroyerShip
    const destroyerShipAbsorb = this.refs.destroyerShipAbsorb
    const warShip = this.refs.warShip
    const warShipAbsorb = this.refs.warShipAbsorb
    const cruiserShip = this.refs.cruiserShip
    const cruiserShipAbsorb = this.refs.cruiserShipAbsorb
    const carrierShip = this.refs.carrierShip
    const carrierShipAbsorb = this.refs.carrierShipAbsorb
    const stealthShip = this.refs.stealthShip
    const stealthShipAbsorb = this.refs.stealthShipAbsorb
    const fireball = this.refs.fireball
    const missile = this.refs.missile
    const trifecta = this.refs.trifecta
    const poisonCannon = this.refs.poisonCannon
    const bomb = this.refs.bomb
    const laser = this.refs.laser
    const blueFire = this.refs.blueFire
    const plasmaCannon = this.refs.plasmaCannon
    const supplyShip = this.refs.supplyShip
    const explosion = this.refs.explosion
    const poison = this.refs.poison
    const slow = this.refs.slow
    const stun = this.refs.stun
    const heal = this.refs.heal
    const armorBoost = this.refs.armorBoost

    this.setState({
      canvas: canvas,
      context: context,
      hunterShip: hunterShip,
      hunterShipAbsorb: hunterShipAbsorb,
      destroyerShip: destroyerShip,
      destroyerShipAbsorb: destroyerShipAbsorb,
      warShip: warShip,
      warShipAbsorb: warShipAbsorb,
      cruiserShip: cruiserShip,
      cruiserShipAbsorb: cruiserShipAbsorb,
      carrierShip: carrierShip,
      carrierShipAbsorb: carrierShipAbsorb,
      stealthShip: stealthShip,
      stealthShipAbsorb: stealthShipAbsorb,
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
      explosion: explosion,
      supplyShip: supplyShip,
      halfWindowWidth: Math.round(window.innerWidth / 2),
      halfWindowHeight: Math.round(window.innerHeight / 2)
    });
  }

  handleImage = (player) => {
    let imageReference = player.type === 'ai' ? 'supplyShip' : SHIPS[player.shipIndex].name
    if (canAbsorbDamage(player)) {
      imageReference += 'Absorb';
    }
    return this.state[imageReference];
  };

  componentDidUpdate() {
    if (this.props.currentPlayer.location) {
      window.scrollTo(this.props.currentPlayer.location.x - this.state.halfWindowWidth, this.props.currentPlayer.location.y - this.state.halfWindowHeight)
    }
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (this.props.gameBuff.color) {
      context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      context.fillStyle = this.props.gameBuff.color;
    }

    this.props.players.forEach((player) => {
      const showShip = shouldRenderShip(player, this.props.currentPlayer.id);
      if (showShip) {
        drawShip(context, player, this.handleImage(player), this.state.thrusterAudio);
        Object.values(player.effects)
          .filter((effect) => [1, 2, 4, 7, 8].includes(effect.id))
          .forEach((effect) => renderAnimation(context, this.state[effect.name], effect, player))
      } else {
        renderExplosion(context, this.state.explosion, player);
      };
      renderPlayerData(this.props.gameBuff, context, player, showShip);
    });

    this.props.deployedWeapons.forEach((weapon) => {
      handleDirection(context, this.state[weapon.name], weapon.location, weapon.trajectory)
      context.restore();
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
        {GAME_EFFECTS.filter((effect, index) => [1, 2, 4, 7, 8].includes(effect.id))
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
        <img ref="explosion" src={explodeAnimation} className="hidden" alt="explosion" />
      </div>
    );
  };
}

export default Canvas
