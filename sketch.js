

//p5

  var mx = 100
  var val = {
    v: 20,
    get val() {
      return Math.min(Math.max(this.v, 0), mx)
    },
    set val(v) {
      if (v) this.v = v
    }
  }
  var ww = 50
  var hh = 500

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

  ball = matter.makeBall(100, 40, 80,{restitution:0.9});
  block = matter.makeBall(200, 40, 30);
  
  //Add a title
  fill('#000');
  noStroke();
  textSize(15);
  // floor = matter.makeBarrier(width / 2, height, width, 50);
}



function keyPressed() {
  var arrowMap = {};

  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    arrowMap[LEFT_ARROW] = -1;
    arrowMap[RIGHT_ARROW] = 1;
    spriteDir = arrowMap[keyCode];
  }
  // ball.setVelocity(10,10)

  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    arrowMap[UP_ARROW] = 10;
    arrowMap[DOWN_ARROW] = -10;
    val.v = val.v + arrowMap[keyCode];
  }
  
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    spriteDir = 0
    if (!block.isFrozen()) {
      block.freeze();
    }
  }
  
}

function draw() {
  // put the drawing code here
  background(255);

  fill(127);
  ball.show();
  block.show();
  image(mcSpicy, block.getPositionX(), block.getPositionY(), 75, 75)
  axes();
  // image(moonImg, moon.getPositionX(), moon.getPositionY());
    // Draw the background

  push();
  fill(222);
  rect(20, 0, ww, hh);
  // Draw the fill
  fill(111);
  var fillVal = Math.min(Math.max(val.v/ mx, 0), 1);
  console.log(fillVal)
  rect(20, 0, ww, fillVal * hh);
  pop()

  for (var i = lines.length - 1; i >= 0; i--) {
    lines[i].show();
  }
  checkBoundaries()

  // ball.show();
}



