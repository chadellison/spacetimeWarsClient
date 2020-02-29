import React from 'react';
import {drawShip, handleDirection} from '../helpers/canvasHelper.js';
import '../styles/styles.css';
import explodeAnimation from '../images/explosion.png';
import {WEAPONS, SHIPS} from '../constants/settings.js';

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
    const fireball = this.refs.fireball
    const torpedo = this.refs.torpedo
    const explosion = this.refs.explosion

    this.setState({
      canvas: canvas,
      context: context,
      fighterShip: fighterShip,
      hunterShip: hunterShip,
      destroyerShip: destroyerShip,
      scoutShip: scoutShip,
      fireball: fireball,
      torpedo: torpedo,
      explosion: explosion
    });
  }

  componentDidUpdate() {
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
          256,
          256,
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
                key={`weapon${index}`}/>
          );
        })}
        <img ref="explosion" src={explodeAnimation} className="hidden" alt="explosion" />
      </div>
    );
  };
}

export default Canvas
