import React from 'react';
import {draw} from '../helpers/canvasHelper.js'

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

  componentDidUpdate(previousProps) {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw(context, this.props.player);
  }

  render() {
    return (
      <canvas
        className="canvas"
        ref={this.canvasRef}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}

export default Canvas
