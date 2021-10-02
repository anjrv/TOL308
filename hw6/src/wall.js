// ==========
// WALL STUFF
// ==========

function Wall(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Wall.prototype.initializeTiles = function () {
  let tiles = [];
  const xTiles = g_canvas.width / this.tileWidth;
  const yTiles = g_canvas.height / this.tileHeight;

  this.topEdge = Math.floor(yTiles * 0.1);
  this.bottomEdge = Math.ceil(yTiles * 0.4);
  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    const row = [];
    for (let j = 0; j < xTiles; j++) {
      if (Math.random() < 0.8) {
        if (Math.random() < 0.1) {
          row.push('S');
        } else {
          row.push('T');
        }
      } else {
        row.push('F');
      }
    }
    tiles[i] = row;
  }

  this.tiles = tiles;
};

Wall.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
  // Inside the wall Y-axis
  if (
    nextY < this.bottomEdge * this.tileHeight &&
    nextY > this.topEdge * this.tileHeight
  ) {
    let row;
    if (nextY < prevY) {
      row = Math.ceil((nextY - r) / this.tileHeight);
    } else {
      row = Math.floor((nextY + r) / this.tileHeight);
    }

    const column = Math.floor(nextX / this.tileWidth);

    if (this.tiles[row][column] === 'T' || this.tiles[row][column] === 'S') {
      this.tiles[row][column] = 'F';
      return true;
    }

    return false;
  }
};

Wall.prototype.update = function (du) {
  if (!this.tiles) {
    this.initializeTiles();
  }
};

Wall.prototype.render = function (ctx, renderFrame) {
  ctx.save();

  const regularGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  regularGradient.addColorStop(0, '#302b3c');
  regularGradient.addColorStop(1, 'rgba(45, 40, 55, 0.8');

  const specialGradient = ctx.createLinearGradient(
    0,
    0,
    this.tileWidth,
    this.tileHeight
  );
  specialGradient.addColorStop(0, '#302b3c');
  specialGradient.addColorStop(1, 'rgba(216, 59, 46, 0.8');

  for (let i = this.topEdge; i <= this.bottomEdge; i++) {
    for (let j = 0; j < this.tiles[this.topEdge].length; j++) {
      if (this.tiles[i][j] === 'T') {
        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          regularGradient,
          '#b482ae'
        );
      } else if (this.tiles[i][j] === 'S') {
        roundedRect(
          ctx,
          j * this.tileWidth,
          i * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
          8,
          specialGradient,
          '#b482ae'
        );
      }
    }
  }
  ctx.restore();
};
