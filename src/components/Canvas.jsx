import React from 'react';
import {drawPacman, drawBoard} from '../helpers/canvasHelper.js'

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    const canvasRef = React.createRef()
    this.state = {
      canvasRef: canvasRef
    }
  }

  componentDidMount() {
    const canvas = this.state.canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.setState({
      canvas: canvas,
      context: context
    });
  }

  componentDidUpdate() {
    const canvas = this.state.canvas;
    const context = this.state.context;
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
        ref={this.state.canvasRef}
        width={this.props.width}
        height={this.props.height}
      />
    );
  };
}

export default Canvas
