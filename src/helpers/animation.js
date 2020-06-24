export class Animation {
  constructor(spriteImage, width, height, renderSize) {
    this.coordinates = {x: 0, y: 0}
    this.spriteImage = spriteImage
    this.width = width
    this.height = height
    this.renderSize = renderSize
  }

  updateFrame = () => {
    if (this.coordinates.x === 750 && this.coordinates.y === 446) {
      this.coordinates = {x: 0, y: 0}
    } else if (this.coordinates.x === 750) {
      this.coordinates.x = 0
      this.coordinates.y += 223
    } else {
      this.coordinates.x += 250
    }
  }
}
