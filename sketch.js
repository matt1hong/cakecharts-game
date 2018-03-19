

//p5

  var mx = 100;
  var val = {
    v: 100,
    get val() {
      return Math.min(Math.max(this.v, 0), mx)
    },
    set val(v) {
      if (v) this.v = v
    }
  }
  var angle = 0;
  var ww = 50;
  var hh = 500;

function preload() {
  mcSpicy = loadImage("mcspicy.png");
}

function setup() {
  // put setup code here.
  createCanvas(600, 600);

  matter.init();
  lineChart();
  line(20,20,200,200);
  imageMode(CENTER);

  ball = matter.makeBall(200, 200, 80,{restitution:0.9});
  ball.freeze()
  block = matter.makeBall(200, 300, 30);
  
  //Add a title
  fill('#000');
  noStroke();
  textSize(15);
  // floor = matter.makeBarrier(width / 2, height, width, 50);
}

var progBarDir = 1
function goUpOrDown (n) {
  if (n === 100) {
    progBarDir = -1 
  } else if (n === 1) {
    progBarDir = 1
  }
  return n + progBarDir
}

function aimCannon() {
  if (keyIsDown(UP_ARROW)) { 
    angle = angle - 1
  } else if (keyIsDown(DOWN_ARROW)) { 
    angle = angle + 1
  }
  Matter.Body.setAngle(ball.body, radians(angle))
}

function keyPressed() {
  var arrowMap = {};

  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    arrowMap[LEFT_ARROW] = -1;
    arrowMap[RIGHT_ARROW] = 1;
    spriteDir = arrowMap[keyCode];
  }

  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    arrowMap[UP_ARROW] = 10;
    arrowMap[DOWN_ARROW] = -10;
    val.v = val.v + arrowMap[keyCode];
  }
  
  if (val.v > 1) val.v = 100
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    spriteDir = 0
    if (!block.isFrozen()) {
      block.freeze();
    }
  }
  if (keyCode ===32) {
    ball.unfreeze()
    Matter.Body.applyForce(ball.body, {
      x: ball.getPositionX(),
      y: ball.getPositionY()
    }, {
      x: Math.cos(ball.body.angle)*(100-val.v)/100,
      y: Math.sin(ball.body.angle)*(100-val.v)/100
    })
  }
}

function draw() {
  // put the drawing code here
  background(255);

  fill(127);
  ball.show();
  block.show();
  push();
  translate(block.getPositionX(), block.getPositionY())
  rotate(radians(angle))
  image(mcSpicy, 0, 0, 75, 75)
  pop();
  axes();
  // image(moonImg, moon.getPositionX(), moon.getPositionY());
    // Draw the background
  push();
  fill(222);
  rect(20, 0, ww, hh);
  // Draw the fill
  fill(111);
  var fillVal = Math.min(Math.max(val.v/ mx, 0), 1);

  rect(20, 0, ww, fillVal * hh);
  pop()
  if (keyIsDown(32)) { // Spacebar
    val.v = goUpOrDown(val.v);
  }
  aimCannon()

  for (var i = lines.length - 1; i >= 0; i--) {
    lines[i].show();
  }
  checkBoundaries()

  // ball.show();
}



