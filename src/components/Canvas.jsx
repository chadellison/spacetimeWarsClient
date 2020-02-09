import React from 'react';
import {drawPacman, drawBoard} from '../helpers/canvasHelper.js'

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.props.players.forEach((player) => {
      drawPacman(context, player);
    })
    drawBoard(context, this.props.board)
  }

  render() {
    return (
      <canvas
        className="canvas"
        ref={this.canvasRef}
        width={this.props.width}
        height={this.props.height}
      />
    );
  };
}

export default Canvas
