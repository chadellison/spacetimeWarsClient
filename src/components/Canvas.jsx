import React from 'react';
import {drawShip, drawWeapon} from '../helpers/canvasHelper.js';
import fighterShip from "../images/fighterShip.png";
import fireball from "../images/fireball.png";
import thrusterAudio from '../audio/thruster.mov';
import '../styles/styles.css';

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
    let thruster = new Audio(thrusterAudio);
    thruster.loop = true;

    fighterShip.onload = () => {
      this.setState({
        canvas: canvas,
        context: context,
        fighterShip: fighterShip,
        thrusterAudio: thruster,
        fireball: fireball
      });
    }
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      drawShip(context, player, this.state.fighterShip, this.state.thrusterAudio);
      player.id === this.props.playerId && player.accelerate ? this.state.thrusterAudio.play() : this.state.thrusterAudio.pause();
    });
    this.props.deployedWeapons.forEach((weapon) => {
      drawWeapon(context, weapon, this.state.fighterShip, this.state.fireball)
    });
  }

  render() {
    return (
      <div>
        <canvas
          className="canvas"
          ref={this.canvasRef}
          width={this.props.width}
          height={this.props.height}
        />
        <img ref="ship" src={fighterShip} className="hidden" alt="fighterShip" />
        {[{name: 'fireball', image: fireball}].map((weapon) => {
          return(
            <img ref={weapon.name}
                src={weapon.image}
                className="hidden"
                alt={weapon.name} />
          );
        })}
      </div>
    );
  };
}

export default Canvas
