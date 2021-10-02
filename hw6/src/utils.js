// =====
// UTILS
// =====

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
  const oldStyle = ctx.fillStyle;
  ctx.fillStyle = style;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = oldStyle;
}

function roundedRect(ctx, x, y, w, h, r, style, stroke) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  const oldStyle = ctx.fillStyle;
  ctx.fillStyle = style;

  const oldStroke = ctx.strokeStyle;
  ctx.strokeStyle = stroke;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = oldStyle;
  ctx.strokeStyle = oldStroke;
}
