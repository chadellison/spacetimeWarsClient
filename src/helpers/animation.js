export class Animation {
  constructor(spriteImage, width, height, renderSize, rowCount, columnCount) {
    this.coordinates = {x: 0, y: 0}
    this.spriteImage = spriteImage
    this.width = width
    this.height = height
    this.renderSize = renderSize
    this.rowCount = rowCount
    this.columnCount = columnCount
  }

  updateFrame = () => {
    if (this.coordinates.x >= this.width * (this.rowCount - 1) && this.coordinates.y >= this.height * (this.columnCount - 1)) {
      this.coordinates = {x: 0, y: 0}
    } else if (this.coordinates.x >= this.width * (this.rowCount - 1)) {
      this.coordinates.x = 0
      this.coordinates.y += this.height
    } else {
      this.coordinates.x += this.width
    }
  }
}
