particleSystem = []
var xspacing = 20;
var waveWidth = 250;
var amplitude = 40;
var dx = 0;
var speed = 1.2


function particleMaker(x, y, z) {
	return {
		x : x,
		y : y,
		z : z,
		vx : 0,
		vy : random(-10, 10),
		vz : 0,
		targetX: x,
		targetY: y,
		targetZ: z
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	for(var i = 0; i < windowWidth; i = i + xspacing) {
		var x = i;
		var tempX = map(i % waveWidth, 0, waveWidth, 0, TWO_PI);
		var tempY = sin(tempX);
		var y = map(tempY, -1, 1, windowHeight / 2 - amplitude, windowHeight / 2 + amplitude);
		particleSystem.push(particleMaker(x, y, random(-25, 25)))
	}
}

function plotDots() {
	noStroke();
	fill(255);
	randomSeed(10);
	pointLight(250, 250, 250, windowWidth/2, windowHeight, 0);
	for(var i = 0; i < particleSystem.length; i++) {
		p = particleSystem[i];
		push();
		translate(p.x, p.y, p.z);

		var tempRandom = random(0, 3);
		if(tempRandom <= 1) {
			ambientMaterial(60, 208, 229);
		} else if(tempRandom <= 2) {
			ambientMaterial(38, 132, 184);
		} else {
			ambientMaterial(38, 128, 171);
		}
		var plusOrMinus = random(0, 1) < 0.5 ? -1 : 1;
		rotateX(radians(random(-50, 50)) * sin(frameCount * 0.03) * plusOrMinus);
		rotateY(random(frameCount) * 0.03 * plusOrMinus);
		rotateZ(radians(random(-10, 10)) * sin(frameCount * 0.06) * plusOrMinus);
		box(15, random(100, 160), 15);
		pop();
	}
}

function updateParticles() {
	dx += speed
	for(var i = 0; i < particleSystem.length; i++) {
		p = particleSystem[i];
		var tempX = (p.x + dx) / waveWidth * TWO_PI;
		var tempY = sin(tempX);
		p.y = map(tempY, -1, 1, windowHeight / 2 - amplitude, windowHeight / 2 + amplitude) + random(-25, 25);
		p.targetY = p.y;
		forceEffect(p);
	}
}

function forceEffect(p) {
	var distance = distanceBetweenMoouse(p);
	var k = 300;
	var force = -0.3 * k / distance;


	if(distance < 300) {
		var dx = p.targetX - mouseX;
		var dy = p.targetY - mouseY;
		var dz = p.targetZ - 0;

		var fX = dx/distance * force;
		var fY = dy/distance * force;
		var fZ = dz/distance * force;


		p.vx = p.vx + fX;
		p.vy = p.vy + fY;
		p.vz = p.vz + fZ;
	}
	particleGoingBack(p);

	p.x = p.x + p.vx;
	p.y = p.y + p.vy;
	p.z = p.z + p.vz;

	var airResistance = 0.8;
	p.vx = p.vx * airResistance;
	p.vy = p.vy * airResistance;
	p.vz = p.vz * airResistance;

}


function particleGoingBack(p) {
	var dx = p.x - p.targetX;
	var dy = p.y - p.targetY;
	var dz = p.z - p.targetZ;

	var distance = max(1, sqrt(dx * dx + dy * dy + dz * dz));
	var force = -distance * 0.01;

	var fX = dx/distance * force;
	var fY = dy/distance * force;
	var fZ = dz/distance * force;

	p.vx = p.vx + fX;
	p.vy = p.vy + fY;
	p.vz = p.vz + fZ;
}

function distanceBetweenMoouse(p) {
	var dx = p.targetX - mouseX;
	var dy = p.targetY - mouseY;
	var dz = p.targetZ - 0;
	return max(1, sqrt(dx * dx + dy * dy + dz * dz));
}

function draw() {
	translate(-windowWidth/2, -windowHeight/2, 0);
	background(0);
	updateParticles();
	plotDots();
}