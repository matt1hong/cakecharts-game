//p5

class Shooter {
  constructor(ball) {
    this.ball = ball
    this.angle = 0
    this.r = 30
    this.bulletRadius = 20
    this.direction = 0
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
    return this.ball.getPositionX() + (this.r + 10) * Math.cos(radians(this.angle)) + this.bulletRadius * Math.cos(radians(this.angle))
  }

  get muzzleY() {
    return this.ball.getPositionY() + (this.r + 10) * Math.sin(radians(this.angle)) + this.bulletRadius * Math.sin(radians(this.angle))
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
      x: Math.cos(bullet.body.angle)*(100-this.powerBar.level)/2000,
      y: Math.sin(bullet.body.angle)*(100-this.powerBar.level)/2000
    })
    setTimeout(function(){
      s.restart({x:bullet.getPositionX(), y:bullet.getPositionY()})
      matter.forget(bullet)
    }, 5000)
  }

  checkForWall() {
    var pos = this.ball.getPositionX();
    if ((pos < margin && this.direction === -1)
      || (pos > width - margin && this.direction === 1)) {
        this.direction = 0
      }
  }

  move() {
    if (!this.ball.isFrozen()) {
      this.checkForWall()
    }
    if (this.direction === 1 || this.direction === -1) {
      this.ball.setVelocityX(this.direction*0.7) 
    }
  }

  show() {
    push();
    translate(this.x, this.y)
    rotate(radians(this.angle))
    image(mcSpicy, 0, 0, 75, 75)
    pop();
  }
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
      } else if (this.level === 1) {
        this.direction = 1
      }
      this.level = this.level + this.direction
    } else {
      this.level = 100
    }
  }

  show() {
    push();
    fill(222);
    rect(20, 0, this.width, this.height);
    // Draw the fill
    fill(111);
    var fillVal = Math.min(Math.max(this.level/this.max, 0), 1);

    rect(20, 0, this.width, fillVal * this.height);
    pop()
  }
}





function preload() {
  mcSpicy = loadImage("mcspicy.png");
}

let player1;
let conn;
var s;
var lineChart;

var prices = [2.99, 4.00, 1.00, 3.5];

function setup() {
  var a = ['#666666']
  for (var i = 3; i >= 0; i--) {
    a = a.concat(a)
  }
  // put setup code here.
  s = new Splasher({x:200,y:200},a)

  createCanvas(600, 600);

  matter.init();
  
  lineChart = new LineChart(prices);
  line(20,20,200,200);
  imageMode(CENTER);


  player1 = new Shooter(matter.makeBall(200, 400, 40));
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (conn) matter.forget(conn)
    if (player1.ball.isFrozen()) {
      player1.ball.unfreeze() 
    }
    player1.direction = -1
  } else if (keyCode === RIGHT_ARROW) {
    if (conn) matter.forget(conn)
    if (player1.ball.isFrozen()) {
      player1.ball.unfreeze() 
    }
    player1.direction = 1
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    player1.direction = 0
    var currentLine = lineChart.findLine(player1.ball.body.position.x)
    conn = matter.connect(player1.ball, currentLine)
    if (!player1.ball.isFrozen()) {
      player1.ball.freeze() 
    }
  }
  if (keyCode ===32) {
    player1.shoot();
  }
}


var Particle = function(x, y, attributes){

  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.attributes = attributes;

  this.update = function(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc = createVector(0, 0);
  }

  this.draw = function(drawer){
    drawer(this);
  }

  this.applyForces = function(forces){
    if(!Array.isArray(forces)){
      this.acc.add(forces);
    }else{
      for(var i = 0; i < forces.length; i++){
        this.acc.add(forces[i]);
      }
    }
    
  }
}


class LineChart {
  constructor(data) {
      this.lines = []
      this.clicked = []
      this.height = height
      this.numPoints = 100
      this.interval = 100/this.numPoints
      this.points = this.interpolatePoints(data, this.numPoints)
      this.createLines()
  }

  findLine(posX) {
      return this.lines.filter(function(line){
      return line.body.bounds.min.x<posX && line.body.bounds.max.x>posX
    })[0]
  }

  interpolatePoints(arr, howMany) {
    var newArr = []
    for (var i = 0; i < arr.length-1; i++) {
      var tempArr = []
      var interval = (arr[i+1] - arr[i])/howMany
      for (var j = 0; j < howMany; j++) {
        tempArr.push(arr[i] + interval * j)
      }
      newArr = newArr.concat(tempArr)
    }
    newArr.push(arr[arr.length-1])
    return newArr
  }

  centerLine(x1,y1,x2,y2) {
    var centerX = (x1+x2)/2, centerY = (y1+y2)/2
    var width = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2))
    var radians = Math.atan((y2-y1)/(x2-x1))
    return [centerX, centerY, width, radians]
  }

  createLines() {
    var adjustedPrice = 0;
    var centered;
    var lastPrice = this.height - map(this.points[0], 0, 5, 0, 100);
    var x1 = 0;
    for (var i=1; i<this.points.length; i++) {
      x1 = (i-1)*this.interval;
      adjustedPrice = this.height - map(this.points[i], 0, 5, 0, 100);
      if (this.clicked.indexOf(x1) < 0) {
        centered = this.centerLine(
          x1, 
          lastPrice, 
          i*this.interval, 
          adjustedPrice
        )
        this.lines.push(matter.makeBarrier(
          centered[0], centered[1], centered[2], 1, {
            angle:centered[3]
          })
        );
      }
      lastPrice = adjustedPrice;
    }
  }

  draw() {
    for (var i = this.lines.length - 1; i >= 0; i--) {
      this.lines[i].show()
    }
  }
}


var Splasher = function(pos, colors){

  this.startPos = pos;
  this.colors = colors;
  this.particles = [];
  this.active = true;

  this.init = function(){


    var xBaseForce = 5;
    var yBaseForce = 2;

    var yOff = 0;
    var xOff = 0;

    for(var i = 0; i < this.colors.length; i++){
      
      var particle = new Particle(this.startPos.x, this.startPos.y,
        {
          radius : Math.random()*15,
          color : colors[i].slice()
        }
      );

      yOff += 0.5;
      xOff += 0.7;

      particle.applyForces(createVector(map(noise(xOff), 0, 1, -1, 1) * xBaseForce, -noise(yOff) * yBaseForce));
      this.particles.push(particle);
    }
  }

  this.init();

  this.update = function(){
    if(this.active){
      for(var i = 0; i < this.particles.length; i++){
        this.particles[i].applyForces([
          createVector(0, .03 * this.particles[i].attributes.radius) //gravity
        ]); 
        //this.particles[i].attributes.color[3] -= 2;
        this.particles[i].update();
      }
    }
  }

  this.draw = function(){
    if(this.active){
      for(var i = 0; i < this.particles.length; i++){
        this.particles[i].draw(drawParticle);
      }
    }
  }

  /*
    Function passed as a drawer for particle draw method.
  */
  var drawParticle = function(particle){
    push();
    noStroke();
    fill(particle.attributes.color);
    ellipse(particle.pos.x, particle.pos.y, particle.attributes.radius);
    pop();
  }

  this.start = function(){
    this.active = true;
  }

  this.reload = function(){
    this.particles = [];
    this.active = false;
    this.init();
  }

  this.restart = function(pos){
    if (pos) {
      this.startPos = pos;
    }
    this.reload();
    this.start();
  }
}



function draw() {
  // put the drawing code here
  background(255)
  // axes()
  s.update();
  s.draw();
  lineChart.draw();

  player1.show()
  player1.move()
  player1.powerBar.show()
  player1.powerBar.progress()
  player1.aim()
  for (var j = player1.bullets.length - 1; j >= 0; j--) {
    var bullet = player1.bullets[j]
    if (bullet.active) {
      bullet.show()
    }
    if (bullet.isOffCanvas()) {
      matter.forget(bullet)
    }
  }
}

