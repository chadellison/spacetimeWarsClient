import React from 'react';
import {drawShip, handleDirection} from '../helpers/canvasHelper.js';
import fighterShip from '../images/fighterShip.png';
import '../styles/styles.css';
import explodeAnimation from '../images/explosion.png';
import {WEAPONS} from '../constants/settings.js';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
    const fighterShip = this.refs.ship
    const fireball = this.refs.fireball
    const torpedo = this.refs.torpedo
    const explosion = this.refs.explosion

    fighterShip.onload = () => {
      this.setState({
        canvas: canvas,
        context: context,
        fighterShip: fighterShip,
        fireball: fireball,
        torpedo: torpedo,
        explosion: explosion
      });
    }
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      if (!player.explode) {
        drawShip(context, player, this.state.fighterShip, this.state.thrusterAudio);
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
        <img ref="ship" src={fighterShip} className="hidden" alt="fighterShip" />
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
