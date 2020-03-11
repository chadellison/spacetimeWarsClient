import React from 'react';
import {drawShip, handleDirection} from '../helpers/canvasHelper.js';
import '../styles/styles.css';
import explodeAnimation from '../images/explosion.png';
import {WEAPONS, SHIPS, SPRITE_WIDTH} from '../constants/settings.js';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
    const fighterShip = this.refs.fighterShip
    const hunterShip = this.refs.hunterShip
    const scoutShip = this.refs.scoutShip
    const destroyerShip = this.refs.destroyerShip
    const warShip = this.refs.warShip
    const cruiserShip = this.refs.cruiserShip
    const carrierShip = this.refs.carrierShip
    const stealthShip = this.refs.stealthShip
    const fireball = this.refs.fireball
    const missile = this.refs.missile
    const trifecta = this.refs.trifecta
    const plasmaCannon = this.refs.plasmaCannon
    const bomb = this.refs.bomb
    const laser = this.refs.laser
    const blueFire = this.refs.blueFire
    const explosion = this.refs.explosion

    this.setState({
      canvas: canvas,
      context: context,
      fighterShip: fighterShip,
      hunterShip: hunterShip,
      destroyerShip: destroyerShip,
      scoutShip: scoutShip,
      warShip: warShip,
      cruiserShip: cruiserShip,
      carrierShip: carrierShip,
      stealthShip: stealthShip,
      fireball: fireball,
      missile: missile,
      trifecta: trifecta,
      plasmaCannon: plasmaCannon,
      bomb: bomb,
      laser: laser,
      blueFire: blueFire,
      explosion: explosion,
      halfWindowWidth: Math.round(window.innerWidth / 2),
      halfWindowHeight: Math.round(window.innerHeight / 2)
    });
  }

  componentDidUpdate() {
    if (this.props.currentPlayer.location) {
      window.scrollTo(this.props.currentPlayer.location.x - this.state.halfWindowWidth, this.props.currentPlayer.location.y - this.state.halfWindowHeight)
    }
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      if (!player.explode) {
        drawShip(context, player, this.state[SHIPS[player.shipIndex].name], this.state.thrusterAudio);
      } else {
        context.drawImage(
          this.state.explosion,
          player.explodeAnimation.x,
          player.explodeAnimation.y,
          SPRITE_WIDTH,
          SPRITE_WIDTH,
          player.location.x,
          player.location.y,
          200,
          200
        )
      };
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
          width={this.props.width}
          height={this.props.height}
        />
        {SHIPS.map((ship, index) => {
          return (
            <img ref={ship.name}
              src={ship.image}
              className="hidden"
              alt={ship.name}
              key={`ship${index}`}/>
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
        <img ref="explosion" src={explodeAnimation} className="hidden" alt="explosion" />
      </div>
    );
  };
}

export default Canvas
