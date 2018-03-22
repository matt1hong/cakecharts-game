

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
  var balls = [];

class Shooter {
  constructor(ball) {
    this.ball = ball
    this.angle = 0
    this.r = 30
    this.bulletRadius = 40
    this.direction = 1
    this.powerBar = new PowerBar()
    this.bullets = []
  }

  get x() {
    return this.ball.getPositionX();
  }

  get y() {
    return this.ball.getPositionY();
  }

  get muzzleX() {
    return this.ball.getPositionX() + r * Math.cos(radians(this.angle)) + bulletRadius * Math.cos(radians(angle))
  }

  get muzzleY() {
    return this.ball.getPositionY() + r * Math.sin(radians(this.angle)) + bulletRadius * Math.sin(radians(angle))
  }

  aim() {
    if (keyIsDown(UP_ARROW)) { 
      this.angle = this.angle - 1
    } else if (keyIsDown(DOWN_ARROW)) { 
      this.angle = this.angle + 1
    }
  }

  shoot() {
    var bullet = matter.makeBall(this.muzzleX, this.muzzleY, this.bulletRadius,{restitution:0.9})
    this.bullets.push(bullet)
    Matter.Body.setAngle(bullet.body, radians(this.angle))
    Matter.Body.applyForce(bullet.body, {
      x: this.muzzleX,
      y: this.muzzleY
    }, {
      x: Math.cos(bullet.body.angle)*(100-this.powerBar.level)/100,
      y: Math.sin(bullet.body.angle)*(100-this.powerBar.level)/100
    })
  }

  checkForWall() {
    var pos = this.ball.getPositionX();
    if ((pos < margin && this.direction === -1)
      || (pos > width - margin && this.direction === 1)) {
        this.direction = 0
      }
  }

  move() {
    this.checkForWall()
    if (this.direction === 0 && !this.ball.isFrozen()) {
      this.ball.freeze()
    } else if (this.direction === 1 || this.direction === -1) {
      this.ball.unfreeze()
      this.ball.setVelocityX(this.direction*0.7) 
    }
  }
}

// class Bullet {
//   constructor(shooter) {
//     this.shooter = shooter
//     this.x = shooter.x
//     this.y = shooter.y
//     this.r = 40
//   }

//   fire() {
//     var xx = block.getPositionX() + 30 * Math.cos(radians(angle));
//     var yy = block.getPositionY() + 30 * Math.sin(radians(angle));
//     if (keyCode ===32) {
//       var ball = matter.makeBall(xx + 40 * Math.cos(radians(angle)), yy + 40 * Math.sin(radians(angle)), 40,{restitution:0.9})
//       balls.push(ball)
//       Matter.Body.setAngle(ball.body, radians(angle))
//       Matter.Body.applyForce(ball.body, {
//         x: xx,
//         y: yy
//       }, {
//         x: Math.cos(ball.body.angle)*(100-val.v)/100,
//         y: Math.sin(ball.body.angle)*(100-val.v)/100
//       })
//     }
//   }
// }

class Line {

}

class PowerBar {
  constructor() {
    this.max = 100
    this.level = 100
    this.height = 500
    this.width = 50
    this.direction = 1
    this.bgColor = 222
    this.color = 111
  }

  progress() {
    if (keyIsDown(32)) {
      if (this.level === 100) {
        this.direction = -1 
      } else if (n === 1) {
        this.direction = 1
      }
      this.level = this.level + this.direction
    }
  }
}

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
}

function keyPressed() {
  var arrowMap = {};

  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    arrowMap[LEFT_ARROW] = -1;
    arrowMap[RIGHT_ARROW] = 1;
    spriteDir = arrowMap[keyCode];
  }

}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    spriteDir = 0
    if (!block.isFrozen()) {
      block.freeze();
    }
  }
  var xx = block.getPositionX() + 30 * Math.cos(radians(angle));
  var yy = block.getPositionY() + 30 * Math.sin(radians(angle));
  if (keyCode ===32) {
    var ball = matter.makeBall(xx + 40 * Math.cos(radians(angle)), yy + 40 * Math.sin(radians(angle)), 80,{restitution:0.9})
    balls.push(ball)
    Matter.Body.setAngle(ball.body, radians(angle))
    Matter.Body.applyForce(ball.body, {
      x: xx,
      y: yy
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
  block.show();
  for (var j = balls.length - 1; j >= 0; j--) {
    var ball = balls[j];
    ball.show();
    if (ball.isOffCanvas()) {
      matter.forget(ball);
    }
  }

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



