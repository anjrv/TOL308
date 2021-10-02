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

  let rad = 2 * Math.PI - (deg * Math.PI) / 180;

  if (flip) {
    rad = (deg * Math.PI) / 180;
  }

  ctx.translate(x + this.width / 2, y + this.height / 2);
  ctx.rotate(rad);

  if (flip) {
    ctx.scale(-1, 1);
  }
  ctx.scale(scale, scale);

  ctx.drawImage(
    this.image,
    -this.width / 2,
    -this.height / 2,
    this.width,
    this.height
  );

  ctx.restore();
};
