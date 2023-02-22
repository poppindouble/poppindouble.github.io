var particleSystem = []


var myline = function(x1, y1, x2, y2) {
	var steps = 5;
	var dx = x2 - x1;
	var dy = y2 - y1;
	for (var i = 1; i < steps - 1; i++) {
		var x = floor(min(width, max(0, x1 + dx * (i / steps))));
		var y = floor(min(height, max(0, y1 + dy * (i / steps))));

		noStroke();
 		fill(255);
 		ellipse(x, y, 3, 3);
	}
}

var Particle = function(x, y) {
	this.vx = 0;
	this.vy = 0;
	this.x = x;
	this.y = y;
};

Particle.prototype.distSquared = function(p) {
	var dx = this.x - p.x;
	var dy = this.y - p.y;
	return dx * dx + dy * dy;
};

Particle.prototype.draw = function() {

 	var closest_p1 = undefined;
 	var closest_p2 = undefined;
 	var closest_d1 = undefined;
 	var closest_d2 = undefined;

 	for (var index = 0; index < particleSystem.length; index++) {
 		var p = particleSystem[index];
 		if (p === this) {
 			continue;
 		}

 		var dp = this.distSquared(p);
 		if (!closest_p1 || closest_d1 >= dp) {
 			closest_p2 = closest_p1;
 			closest_d2 = closest_d1;
 			closest_p1 = p;
 			closest_d1 = dp;
 		} else if (!closest_p2 || closest_d2 >= dp) {
 			closest_p2 = p;
 			closest_d2 = dp
 		}
 	}

 	stroke(0);
 	strokeWeight(3);
 	if (closest_p1) {
 		myline(this.x, this.y, closest_p1.x, closest_p1.y);
 	}
 	if (closest_p2) {
 		myline(this.x, this.y, closest_p2.x, closest_p2.y);
 	}

 	if (closest_p1 && closest_p2) {
 		//myline(closest_p1.x, closest_p1.y, closest_p2.x, closest_p2.y);
 	}


	noStroke();
 	fill(255);
 	ellipse(this.x, this.y, 10, 10);
};

Particle.prototype.update = function(){
	var springRate = 0.01;
	if(this.x > windowWidth) {
		this.vx = this.vx + (windowWidth - this.x) * springRate;
	}

	if(this.y > windowHeight) {
		this.vy = this.vy + (windowHeight - this.y) * springRate;
	}

	if(this.x < 0) {
		this.vx = this.vx + (0 - this.x) * springRate;
	}

	if(this.y < 0) {
		this.vy = this.vy + (0 - this.y) * springRate;
	}
	this.vx = this.vx * 0.9;
	this.vy = this.vy * 0.9;
	this.x = this.x + this.vx;
	this.y = this.y + this.vy;
};



function setup() {
	var myCanvas = createCanvas(windowWidth, windowHeight);
 	// myCanvas.parent('myCanvas');
}

function update() {
	if (floor(millis() / 100) % 2 == 0 && frameRate() > 50) {
		var p = new Particle(random(windowWidth), random(windowHeight));
 	 	particleSystem.push(p);
	}
	for(var i = 0; i < particleSystem.length; i++) {
		var p1 = particleSystem[i];
		var p2 = new Particle(mouseX, mouseY);
		var dx = p2.x - p1.x;
		var dy = p2.y - p1.y;
		var d = max(10, sqrt(dx * dx + dy * dy));
		var normalizedX = dx/d;
		var normalizedY = dy/d;
		// var force = sin(2 * d / PI / (40) ) * 0.3;
		// var force = -1 / (d * d) * 5000;
		// var force = sin(2 * d / PI / (50) ) * 1;
		var force = sin(millis() / 1000.0) * log(d / 100) * 1;
		// var force = ((min(0, pow(sin(millis() /1000.0), 11)) + 0.5) * 2) * 1
		p1.vx = p1.vx + force * normalizedX;
		p1.vy = p1.vy + force * normalizedY;
	}
	for(var i = 0; i < particleSystem.length; i++) {
		for(var j = i + 1; j < particleSystem.length; j++) {
			var p1 = particleSystem[i];
			var p2 = particleSystem[j];
			var dx = p2.x - p1.x;
			var dy = p2.y - p1.y;
			var d = max(50, sqrt(dx * dx + dy * dy));
			var normalizedX = dx/d;
			var normalizedY = dy/d;

			//force between different dots
			var force = -1 / (d * d) * 1000;

			p1.vx = p1.vx + force * normalizedX;
			p1.vy = p1.vy + force * normalizedY;

			p2.vx = p2.vx - force * normalizedX;
			p2.vy = p2.vy - force * normalizedY;
		}
	}
	for(var index = 0; index < particleSystem.length; index++) {
		particleSystem[index].update();
	}
}

// this function is getting called every frame
function draw() {
	//updating all the partical
	update();
	//drawing
	background(41, 128, 185);
	for(var index = 0; index < particleSystem.length; index++) {
		particleSystem[index].draw()
	}

	//text("fps" + frameRate(), 25, 100);
}