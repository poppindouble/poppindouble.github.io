var centerPointSystem = [];
var newCenterPointSystem = [];

function myLine(x1, y1, x2, y2) {
	var step = 5;
	var dx = x2 - x1;
	var dy = y2 - y1;
	for(var i = 0; i < step - 1; i++) {
		x1 += dx / 5;
		y1 += dy / 5;
		noStroke()
		fill(0)
		ellipse(x1, y1, 5, 5)
	}
}

function particleMaker(thetha, speed, centerPoint, radius) {
	return {
		x : radius * cos(thetha) + centerPoint.x,
		y : radius * sin(thetha) + centerPoint.y,
		thetha : thetha,
		speed : speed,
		centerPoint: centerPoint,
		radius: radius
	}
}

function centerPointMaker(x, y) {
	return {
		x : x,
		y : y,
		vx : 0,
		vy : 0,
		isAbsorb : false
	}
}

function newCenterPointMaker(x, y, absorbCenterPoints) {
	return {
		x : x,
		y : y,
		vx : 0,
		vy : 0,
		absorbCenterPoints : absorbCenterPoints
	}
}

function plotSecondCenterPoint(p) {
	noStroke();
	fill(0);
	ellipse(p.x, p.y, 8, 8);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	randomSeed(10);
}

function update(p) {
	p.thetha += p.speed;
	p.x = p.radius * cos(p.thetha) + p.centerPoint.x;
	p.y = p.radius * sin(p.thetha) + p.centerPoint.y;
}

function updateCenter(center) {
	if (!center.isAbsorb) {
		center.vx += random(-0.2, 0.2);
		center.vy += random(-0.2, 0.2);
		center.x += center.vx;
		center.y += center.vy;
		center.vx = center.vx * 0.8;
		center.vy = center.vy * 0.8;
	} else {
		update(center);
	}
}

function updateNewCenter(center) {
	center.vx += random(-0.5, 0.5);
	center.vy += random(-0.2, 0.2);
	center.x += center.vx;
	center.y += center.vy;
	center.vx = center.vx * 0.95;
	center.vy = center.vy * 0.95;
}

function updateCenterWithNewCenter(newCenter, center) {
	var distance = int(dist(newCenter.x, newCenter.y, center.x, center.y));
	if (distance < 50 && !center.isAbsorb) {
		center.isAbsorb = true;
		var v1 = createVector(newCenter.x, newCenter.y);
		var v2 = createVector(center.x, center.y);
		var angle = p5.Vector.angleBetween(v1, v2);
		center.thetha = angle;
		center.speed = random(-0.1, 0.1);
		center.centerPoint = newCenter;
		center.radius = distance;
		newCenter.absorbCenterPoints.push(center);
	}	
}

function plot(p) {
	noStroke();
	fill(0);
	ellipse(p.x, p.y, 5, 5);
}

function plotNewCenterPoint(p) {
	stroke(0);
	fill(150);
	strokeWeight(2);
	ellipse(p.x, p.y, 15, 15);
}

function draw() {
	background(255);
	translate(width / 2, height / 2);

	if (floor(millis() / 100) % 2 == 0 && frameRate() > 40 && centerPointSystem.length < 200) {
		var radius = random(15, 40);
		var centerPoint = centerPointMaker(random(-width / 2, width / 2), random(-height / 2, height / 2));
		var endPoint = particleMaker(random(-PI, PI), random(-0.1, 0.1), centerPoint, radius);
		var endPoint2 = particleMaker(random(-PI, PI), random(-0.1, 0.1), centerPoint, radius);
		centerPoint.endPoint = endPoint;
		centerPoint.endPoint2 = endPoint2;
		centerPointSystem.push(centerPoint);
	}

	if (floor(millis() / 10) % 10 == 0 && frameRate() > 40 && newCenterPointSystem.length < 10) {
		var newCenterPoint = newCenterPointMaker(random(-width / 4, width / 4), random(-height / 3, height / 3), []);
		newCenterPointSystem.push(newCenterPoint);
	}

	for(var i = 0; i < centerPointSystem.length; i++) {
		var p = centerPointSystem[i];
		updateCenter(p);
		update(p.endPoint);
		update(p.endPoint2);		
	}

	for(var i = 0; i < newCenterPointSystem.length; i++) {
		var p = newCenterPointSystem[i];
		updateNewCenter(p);
		for(var j = 0; j < centerPointSystem.length; j++) {
			var p2 = centerPointSystem[j];
			updateCenterWithNewCenter(p, p2);
		}
	}

	//ploting
	for(var i = 0; i < newCenterPointSystem.length; i++) {
		plotNewCenterPoint(newCenterPointSystem[i]);
	}

	for(var i = 0; i < centerPointSystem.length; i++) {
		var p = centerPointSystem[i];
		plotSecondCenterPoint(p);
		plot(p.endPoint);
		plot(p.endPoint2);
		stroke(0);
		strokeWeight(5);
		// myLine(p.endPoint.x, p.endPoint.y, p.endPoint2.x, p.endPoint2.y);
	}

}