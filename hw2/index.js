'use strict';
/* jshint browser: true, devel: true, globalstrict: true */

/*
Stay within this 72 character margin, to keep your code easily readable
         1         2         3         4         5         6         7
123456789012345678901234567890123456789012345678901234567890123456789012
*/

// ======================
// IMPORTANT INSTRUCTIONS
// ======================
//
// * Submit your URL with an explicit numerical version suffix
//   (e.g. "jsfiddle.net/qWeRtY/0" denoting version 0)
//   NB: If you do not provide a suffix, the marker is allowed
//   to assume anything. In particular, they may assume 0.
//
// * DON'T CHEAT!
//   My anti-plagiarism policy is quite severe.
//   You have been warned!

// =========
// YOUR TASK
// =========
//
// Draw a "Watchmen" smiley (with blood),
// centred at x=200 y=200 and with a radius of 150 pixels.
//
// You must use standard canvas drawing primitives
// (excluding "drawImage" and any other use of external files)
//
// The reference images shown below the canvas are provided as
// a guide to two stylistic variants (the "comic" and "movie"
// versions respectively).
//
// You do not have to implement the global rotation effect as
// seen on the movie version (yet!).
//
// `fillEllipse` has been provided for you as a helper function. ;-)
//
// MARKING CRITERIA:
//
// 1 point given for each of the following 25 items:
//
// * Bounding circle has correct position and size
// * Bounding circle is filled with yellow and/or orange hues
// * Bounding circle isn't just a single flat colour
// * Bounding circle has a thin black outline
// * Face has 2 eyes
// * Eyes are in roughly correct place
// * Eyes are symmetrical
// * Eyes are tall ellipses
// * Eyes are filled black
// * Face has a smile
// * Smile is in roughly correct place
// * Smile is symmetrical
// * Smile is between 90 and 180 degrees wide
// * Smile is filled black
// * Smile is of roughly correct thickness
// * Face has 2 "cheeks/dimples" at edges of mouth
// * Cheeks connect with smile
// * Cheeks are symmetrical
// * Cheeks are elliptical
// * Cheeks are tilted inwards
// * Cheeks are of roughly correct thickness
// * Blood exists
// * Blood overlaps with left eye
// * Blood is red
// * Blood has "splat-like" appearance towards top-left edge
//
// Up to 5 discretionary penalty points may be deducted for:
//
// * poor code-quality e.g. clumsy structure, excessive repetition,
//   poor naming, lack of clarity, lack of appropriate comments, etc
//
// TIPS:
// Consider writing some helper functions to reduce clutter and
// repetition in your code. Large functions are frowned upon.
// Good naming can be very helpful: aim to balance clarity & concision.
//
// EXTRA:
// Well done if you can make the smile slightly thicker at the bottom!
//

// It's up to you whether to take advantage of these variables.
var g_defaultSmileyX = 200,
  g_defaultSmileyY = 200,
  g_defaultSmileyRadius = 150;

// =======================
// YOUR STUFF GOES HERE...
// =======================

function drawBackground(ctx) {
  var gradient = ctx.createRadialGradient(
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius - 15,
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius
  );

  gradient.addColorStop(0, '#ffd000');
  gradient.addColorStop(1, 'gray');

  ctx.fillStyle = gradient;
  ctx.arc(
    g_defaultSmileyX,
    g_defaultSmileyY,
    g_defaultSmileyRadius,
    0,
    2 * Math.PI
  );

  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSmile(ctx) {
  ctx.beginPath();
  ctx.moveTo(120, 240);
  ctx.bezierCurveTo(120, 290, 280, 290, 280, 240);
  ctx.bezierCurveTo(280, 300, 120, 300, 120, 240);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
}

function splatter(ctx) {
  // Smaller shadow on blood
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = '#bd0111';

  ctx.beginPath();
  ctx.moveTo(95, 95);
  ctx.bezierCurveTo(95, 110, 130, 110, 130, 120);
  ctx.bezierCurveTo(130, 125, 110, 125, 110, 115);
  ctx.bezierCurveTo(110, 150, 180, 150, 180, 180);
  ctx.bezierCurveTo(180, 200, 110, 125, 100, 130);
  ctx.bezierCurveTo(100, 160, 130, 170, 130, 180);
  ctx.bezierCurveTo(130, 200, 100, 150, 75, 130);
  ctx.bezierCurveTo(75, 130, 75, 130, 73, 125);
  ctx.bezierCurveTo(75, 105, 99, 96, 97, 95);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// Replace my place-holder implementation of `drawDefaultSmiley` with your own.
// Use the same function name though (this will be important later).
//
function drawDefaultSmiley(ctx) {
  // Circle itself and gradient
  drawBackground(ctx);

  // Add some drop shadow to facial features
  // to match gradient
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 1;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.fillStyle = 'black';

  // Eyes
  fillEllipse(ctx, 150, 150, 10, 40, Math.PI);
  fillEllipse(ctx, 250, 150, 10, 40, Math.PI);

  // Smile
  drawSmile(ctx);

  // Cheeks
  fillEllipse(ctx, 120, 240, 3, 14, 0.4 * Math.PI);
  fillEllipse(ctx, 280, 240, 3, 14, 0.6 * Math.PI);

  // Splatter
  splatter(ctx);
}

// =============
// TEST "DRIVER"
// =============

function draw() {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  drawDefaultSmiley(ctx);
}

draw();

// ================
// HELPER FUNCTIONS
// ================

function fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
  ctx.save(); // save the current ctx state, to restore later
  ctx.beginPath();

  // These "matrix ops" are applied in last-to-first order
  // ..which can seem a bit weird, but actually makes sense
  //
  // After modifying the ctx state like this, it's important
  // to restore it
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(halfWidth, halfHeight);

  // Just draw a unit circle, and let the matrices do the rest!
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath(); // reset to an empty path
  ctx.restore();
}
