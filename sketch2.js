

function setup() {
	var myCanvas = createCanvas(windowWidth, windowHeight);
 	// myCanvas.parent('myCanvas');
}

function tree(x, y, length, angle) {
  if (length < 5) {
    return;
  } 
  var ny = y - length * sin(angle);
  var nx = x + length * cos(angle);
  stroke(0);
  line(x, y, nx, ny);
  var dangle = PI/2 * (mouseX / width) * random(0, 1);
  var bias = PI/2 * (mouseY / height - 0.5);
  var new_l = length * random(0.5, 0.9);
  tree(nx, ny, new_l, angle + dangle + bias);
  tree(nx, ny, new_l, angle - dangle + bias);
}

function draw() {
  background(255);
  randomSeed(0);
  tree(width / 2, height, height / 5, PI/2);
}