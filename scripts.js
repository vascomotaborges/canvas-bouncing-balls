/* jslint browser:true */

(function(){
	
    "use strict";

	/* Select and size canvas */

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var canvasResize;
	(canvasResize = function(){
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
	}).call();
	window.addEventListener('resize', canvasResize, false);

	/* Detect click position
	   based on http://stackoverflow.com/a/18053642 */

	var getPos = function(event) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	    	x: event.clientX - rect.left,
	    	y: event.clientY - rect.top
	    };
	};

	/* Ball objects */

	var balls = [];

	var Ball = function Ball(x, y, color, size, gravity, vel, angle){
		this.x = x;
		this.y = y;
		this.color = color;
		this.size = size;
		this.gravity = gravity;
		this.friction = this.gravity/5;
		this.velx = vel * Math.cos(angle); 	// calculate x velocity
		this.vely = vel * Math.sin(angle); 	// calculate y velocity
		this.draw();
	};

	Ball.prototype.update = function(){
		this.x += this.velx;
		this.y -= this.vely;
		if (this.x >= window.innerWidth){ 	 // bounce right
			this.x = window.innerWidth;
			this.velx = - this.velx;
		} else if (this.x <= 0) {			 // bounce left
			this.x = 0;
			this.velx = - this.velx;
		}
		if(this.y >= window.innerHeight){ 	 // bounce bottom
			this.y = window.innerHeight;
			this.vely = - this.vely - this.gravity;
			if (this.velx > 0) {
				this.velx = (this.velx - this.friction < 0) ? 0 : this.velx - this.friction;
			} else {
				this.velx = (this.velx + this.friction > 0) ? 0 : this.velx + this.friction;
			}
		} else {
			this.vely -= this.gravity;
		}
	};

	Ball.prototype.draw = function(){
		context.beginPath();
		context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
	};

	/* Fire ball on click 
	   Random number generation http://stackoverflow.com/a/7228322 */

	var fireBall = function(event){
		var pos = getPos(event);												// get click location
		var size = Math.floor((Math.random()*(20-5+1)+5));						// size: 5 to 20 px
		var grav = size/5; 														// gravity: based in size
		var color = 'rgb(' + (255*Math.random()|0) + ',' + 						// color (red)
							 (255*Math.random()|0) + ',' + 						// color (green)
							 (255*Math.random()|0) + ')'; 						// color (blue)
		var vel = Math.floor(Math.random()*(25-10+1)+10);						// velocity: 10 to 25 px per frame
		var angle = Math.floor((Math.random()*(90-5+1)+5)) * (Math.PI / 180); 	// angle: 5 to 90 degrees
		balls.push(
			new Ball(
				pos.x,
				pos.y,
				color,
				size,
				grav,
				vel,
				angle
			)
		);
		
	};
	canvas.addEventListener("click", fireBall, false);

	/* Animate objects each 16ms (~60 FPS) */

	setInterval(function() {
		context.clearRect(0, 0, canvas.width, canvas.height); 	// clear the canvas
		for(var i=0;i<balls.length;i++) {
			balls[i].update();	// update balls position
			balls[i].draw();	// redraw all balls
      }
	},16);

})();