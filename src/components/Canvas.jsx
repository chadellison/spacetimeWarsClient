import React from 'react';
import {drawShip} from '../helpers/canvasHelper.js';
import fighterShip from "../images/fighterShip.png";
import fireball from "../images/fireball.png";
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

    fighterShip.onload = () => {
      this.setState({
        canvas: canvas,
        context: context,
        fighterShip: fighterShip,
        fireball: fireball
      });
    }
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      if (player.lastEvent !== 'explode') {
        drawShip(context, player, this.state.fighterShip, this.state.thrusterAudio);
      }
    });
    this.props.deployedWeapons.forEach((weapon) => {
      context.drawImage(this.state.fireball, weapon.location.x, weapon.location.y)
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
        {[{name: 'fireball', image: fireball}].map((weapon, index) => {
          return(
            <img ref={weapon.name}
                src={weapon.image}
                className="hidden"
                alt={weapon.name}
                key={`weapon${index}`}/>
          );
        })}
      </div>
    );
  };
}

export default Canvas
