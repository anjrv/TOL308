// Watchmen Smiley, with gradient and blood, and scale and rotation
// ...and keyboard-handling to move it around

"use strict";
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
// * Don't modify this framework except where instructed.
//   It is here to help you (and to help us when marking!)
//
// * DON'T CHEAT!


// ==========
// OBJECTIVES
// ==========
//
// * Draw a "midground" smiley at coords x=350, y=50 with radius=50
// * WASD keys should move it up/left/down/right by 10 pixels-per-event
// * OP keys should divide/multiply its radius by a factor of 1.1
// * QE keys should reduce/increase its orientation by 1/37th of a
//      revolution.
// * T should toggle a "trail" behind the moveable one.
//   HINT: Doing this is actually easier than NOT doing it!
//
// * B should toggle a background of 2 other smileys
// * F should toggle a foreground of 2 other smileys
// * One of the foreground smileys should rotate in the opposite
//   direction to the player-moveable one.
//
// * M should toggle support for moving the smiley via the mouse
//
// * The background should be on by default
// * The foreground should be on by default
// * The trail should be off by default
// * The mouse-control should be off by default
//
// NB: The trail *doesn't* have to be preserved across F and B toggles
//     Typically, either of these toggles will have the side-effect of
//     erasing the current trail.
//
//     The drawBackground and drawForeground functions have been
//     provided for you, but you'll have to modify the foreground one
//     to implement the counter-rotation feature.


// ============
// UGLY GLOBALS
// ============
//
// Regrettable, but they just make things easier.
//
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_trail = false;
var g_mousemove = false;
var g_background = true;
var g_foreground = true;
var g_keys = [];

// ================
// HELPER FUNCTIONS
// ================

function clear() {
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
}

function drawBackground() {
    drawDefaultSmiley(g_ctx);
    drawSmileyAt(g_ctx,  25, 375,  25, -Math.PI/8);
}

function drawForeground() {
    drawSmileyAt(g_ctx,  25, 375,  25, Math.PI/8);
    drawSmileyAt(g_ctx, 300, 300, 100, -g_smiley.angle);
}

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
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.restore();
}


// =================
// MATRIX CLEVERNESS
// =================

function drawSmileyAt(ctx, cx, cy, radius, angle) {
    // This matrix trickery lets me take a "default smiley",
    // and transform it so I can draw it anyway, at any size,
    // and at any angle.
    //
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var scale = radius / g_defaultSmileyRadius;
    ctx.scale(scale, scale);
    ctx.translate(-g_defaultSmileyX, -g_defaultSmileyY);
    drawDefaultSmiley(ctx);
    ctx.restore();
}


// =================
// OUR SMILEY OBJECT
// =================

// Let's make the user-controllable smiley into a simple
// little javascript object. (Global for "convenience").
//
var g_smiley = {
    x : 350,
    y :  50,
    
    radius : 50,
    angle  : 0
};

// Let's add a draw method...
//
// (We could have done that above, but I find that it's sometimes
// cleaner to add the functions separately, to reduce indentation.)
//
g_smiley.draw = function() {
    drawSmileyAt(g_ctx, 
                 this.x, this.y, 
                 this.radius, this.angle);
};

// You *might* want to add other methods here, as part of your
// implementation.. or you could just manipulate the object
// state directly from inside other (non-member) functions.
//
// On a small project like this, direct manipulation is fine,
// and might be simpler. On a larger project, you would be
// more likely to do everything via "methods" i.e. functions
// which belong to the object itself.

function strokeArc(ctx, x, y, radius, startAngle, endAngle)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
}

// =====================================================
// YOUR VERSION OF drawDefaultSmiley(ctx) SHOULD GO HERE
// =====================================================

var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;

function drawbg(ctx) {
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
    ctx.beginPath();
}

function drawDefaultSmiley(ctx) {
    // Circle itself and gradient
    ctx.save();
    
    var gradient = ctx.createRadialGradient(
    		g_defaultSmileyX,
        g_defaultSmileyY,
      	(g_defaultSmileyRadius - 15),
    		g_defaultSmileyX,
        g_defaultSmileyY,
      	g_defaultSmileyRadius
    );
    
    gradient.addColorStop(0, "#ffd000");
    gradient.addColorStop(1, "gray");
    ctx.fillStyle = gradient;
    drawbg(ctx);
    // Add some drop shadow to facial features
    // to match gradient
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 1;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.fillStyle = "black";
    // Eyes
    fillEllipse(ctx, 150, 150, 10, 40, Math.PI);
    fillEllipse(ctx, 250, 150, 10, 40, Math.PI);
    // Smile
    drawSmile(ctx);
    // Cheeks
    fillEllipse(ctx, 120, 240, 3, 14, 0.4 * Math.PI);
    fillEllipse(ctx, 280, 240, 3, 14, 0.6 * Math.PI);
    // Splatter
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "#bd0111";
    splatter(ctx);
    
    ctx.restore();
}

// ======
// REDRAW
// ======
//
// Your code should call this when needed, to update the
// screen. You'll have to edit this routine to make it do
// everything that is required (e.g. background, foreground,
// dealing with the "trail" etc).
//
function redraw() {    
		if (!g_trail) {
    	refreshBackground();
    }
    
    g_smiley.draw();
    
    refreshForeground();
}


// ========================================
// YOUR EVENT-HANDLING STUFF SHOULD GO HERE
// ========================================

function refreshBackground() {
		if (g_background) {
  			clear();
      	drawBackground();
    } else {
      	clear();
    }
}

function refreshForeground() {
		if (g_foreground) {
    		drawForeground();
    }
}

function leftRight () {
		if (g_keys[65])
    		g_smiley.x -= 10;
    
    if (g_keys[68])
    		g_smiley.x += 10;
}

function upDown () {
		if (g_keys[87])
    		g_smiley.y -= 10;
    
    if (g_keys[83])
    		g_smiley.y += 10;
}

function shrinkGrow () {
		if (g_keys[79])
    		g_smiley.radius /= 1.1;
    
    if (g_keys[80])
    		g_smiley.radius *= 1.1;
}

function swivel () {
		var diff = 1/37 * 2 * Math.PI;

		if (g_keys[81])
    		g_smiley.angle -= diff;
    
    if (g_keys[69])
    		g_smiley.angle += diff;
}

function handleMouse(evt) {  
    g_smiley.x = evt.clientX;
    g_smiley.y = evt.clientY;
    
    redraw();
}

function toggleMouse() {
		if (g_keys[77])
    		g_mousemove = !g_mousemove;
        
    if (g_mousemove) {
    		window.addEventListener("mousemove", handleMouse);
    } else {
    		window.removeEventListener("mousemove", handleMouse);
    }
}

function toggleForeground () {
		if (g_keys[70]) {
    		g_foreground = !g_foreground;
      
        if(!g_foreground) {
      		  refreshBackground();
        }
    }
}

function toggleBackground () {
		if (g_keys[66]) {
    		g_background = !g_background;
      	refreshBackground();
    }
}

function handleKeydown(evt) {
    g_keys[evt.keyCode] = true;
    
    // Trail toggle
    // T
    if (g_keys[84])
    		g_trail = !g_trail;
    
    // Foreground toggle, redraw handles actual drawing
    // F
    toggleForeground();
    
    // Background toggle, this is drawn once
    // To make it actually stay behind the trail
    // B
    toggleBackground();
    
    // Toggle mouse event listener
    // M
    toggleMouse();
    
		// A / D
    leftRight();
    
    // W / S
    upDown();
    
    // O / P
    shrinkGrow();
    
    // Q / E
    swivel();
    
    redraw();
}

function handleKeyup(evt) {
    g_keys[evt.keyCode] = false;
}

function initKeyboardHandlers() {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
}

initKeyboardHandlers();
redraw();
