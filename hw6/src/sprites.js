// ============
// SPRITE STUFF
// ============

// Construct a "sprite" from the given `image`
function Sprite(img) {
  this.image = img;
  this.height = img.height;
  this.width = img.width;
}

Sprite.prototype.drawCentredAt = function (
  ctx,
  x,
  y,
  scale = 1,
  deg = 0,
  flip = false
) {
  ctx.save();

  let xScale = scale;
  if (flip) {
    xScale *= -1;
  }

  ctx.setTransform(xScale, 0, 0, scale, x, y);

  let rad = 2 * Math.PI - (deg * Math.PI) / 180;
  if (flip) {
    rad = (deg * Math.PI) / 180;
  }

  ctx.rotate(rad);
  ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
  ctx.restore();
};
