import React from 'react';
import {drawShip} from '../helpers/canvasHelper.js';
import fighterShip from "../images/fighterShip.png";

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
    fighterShip.onload = () => {
      this.setState({
        canvas: canvas,
        context: context,
        fighterShip: fighterShip
      });
    }
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      drawShip(context, player, this.state.fighterShip);
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
      </div>
    );
  };
}

export default Canvas
