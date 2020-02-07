import React from 'react';

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
        ref={this.canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    )
  }
}

const draw = (ctx, player) => {
  ctx.beginPath();

  if (player.direction === 1) {
    ctx.arc(player.location.x, 50, 25, (Math.PI / 180) * player.mouthOpenValue, (Math.PI / 180) * (360 - player.mouthOpenValue));
  }
  else {
    ctx.arc(player.location.x, 50, 25, (Math.PI / 180) * (179 - player.mouthOpenValue), (Math.PI / 180) * (180 + player.mouthOpenValue), true);
  }
  ctx.lineTo(player.location.x, 50);
  ctx.fillStyle = '#FF0';
  ctx.fill();
}

export default Canvas
