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
  if (player.direction === 'right') {
    ctx.arc(player.location.x, player.location.y, 25, (Math.PI / 180) * player.mouthOpenValue, (Math.PI / 180) * (360 - player.mouthOpenValue));
  } else if (player.direction === 'left') {
    ctx.arc(player.location.x, player.location.y, 25, (Math.PI / 180) * (179 - player.mouthOpenValue), (Math.PI / 180) * (180 + player.mouthOpenValue), true);
  } else if (player.direction === 'up') {
    console.log('up')
  } else if (player.direction === 'down') {
    console.log('down')
  }

  ctx.lineTo(player.location.x, player.location.y);
  ctx.fillStyle = '#FF0';
  ctx.fill();
}

export default Canvas
