/* This is the start of a simple p5.js sketch using p5-matter.
 Use this as a template for creating your own sketches! */

var ball;
var block;
var floor;

var arrowMap = {};

var prices = [2.99, 4.00, 1.00, 3.5];
var interval = 100;
//  Lines are divided into this many total parts, so that each can be partially destroyed
var totalSegments = 1;
var segmentLineBy = Math.max(1,totalSegments/prices.length);
// var numLineParts = totalSegments/
var lines = [];
var clicked = [];

var spriteIndex = 2;
var targetIndex = -1;
var spriteTarget = {x:0, y:0};
var spriteDir = 0;
var text_size = 10
var text2

function lineChart() {
  var lastPrice = height - map(prices[0], 0, 5, 0, 100);
  var x1 = 0;
  for (var i=1; i<prices.length; i++) {
    x1 = (i-1)*interval;
    adjustedPrice = height - map(prices[i], 0, 5, 0, 100);
    if (clicked.indexOf(x1) < 0) {
      centered = centerLine(
        x1, 
        lastPrice, 
        x1+(interval/segmentLineBy), 
        lastPrice+(adjustedPrice-lastPrice)/segmentLineBy
      )
      lines.push(matter.makeBarrier(
        centered[0], centered[1], centered[2], 1, {
          angle:centered[3]
        })
      );
    }
    lastPrice = adjustedPrice;
    
  }
}

p5.prototype.D3p5axis = function(d3Axis, x, y) {
  x = x || 0;
  y = y || 0;
  var D3scaleObj = d3Axis.scale();  
  var customDOMaxis = d3.select('body').append('custom').style('display', 'none').call(d3Axis);
  var ticks = customDOMaxis.selectAll('g');
  
  var returnFunction = function() {}
  
  returnFunction.drawTicks = function(drawFunction) {
    push();
    translate(x,y);
    ticks.each(function() {
      var translateObj = getTranslation(d3.select(this).attr('transform'));
      var translateX = translateObj[0];
      var translateY = translateObj[1];
      push();
      translate(translateX, translateY);
      var txt = d3.select(this).select('text').text();
      drawFunction(txt);
      pop();
    });
    pop();
  }
  
  returnFunction.drawConnectingLine = function(drawFunction) {
    push();
    translate(x,y);
    drawFunction(D3scaleObj.range()[0],D3scaleObj.range()[1]);
    pop();
  }
  
  return returnFunction;
}

function getTranslation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);
  
  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  var matrix = g.transform.baseVal.consolidate().matrix;
  
  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}

function centerLine(x1,y1,x2,y2) {
  var centerX = (x1+x2)/2, centerY = (y1+y2)/2
  var width = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2))
  var radians = Math.atan((y2-y1)/(x2-x1))
  return [centerX, centerY, width, radians]
}

function setup() {
  // put setup code here.
  createCanvas(600, 600);

  matter.init();
  lineChart();
  line(20,20,200,200);

  ball = matter.makeBall(width / 2, 40, 80,{restitution:0.9});
  block = matter.makeBall(200, 40, 30);
  
  //Add a title
  fill('#000');
  noStroke();
  textSize(15);
  // floor = matter.makeBarrier(width / 2, height, width, 50);
}

function axes() {
        margin = 30;
  
  // createCanvas(width + margin*2, height + margin*2);
  
  push();
  translate(margin,margin);  
  
  
  //y axis
  var D3yscale = d3.scaleLinear()
    .domain([0, 10])
    .range([height,0]);
  
  var D3yaxis = d3.axisLeft()
    .scale(D3yscale)
  
  var p5yaxis = D3p5axis(D3yaxis);
  
  p5yaxis.drawTicks(function(txt) {
    stroke('#ddd');
    line(0,0,width,0);
    noStroke();
    fill('black');
    textAlign(RIGHT);
    text(txt, -5, 5);
  });
  
  p5yaxis.drawConnectingLine(function(startX, endX) {
    //no line connecting
  });
  
    //x axis
  var D3xscale = d3.scaleBand()
    .domain(['planes','trains','automobiles', 'ferries', 'subways', 'taxis', 'ubers', 'lyft'])
    .rangeRound([0,width])
    .padding(0.1);
  
  var D3xaxis = d3.axisBottom()
    .scale(D3xscale)

  var p5axis = D3p5axis(D3xaxis, 0, height);
  
  p5axis.drawTicks(function(txt) {
    fill('black');
    noStroke();
    textAlign(CENTER);
    text(txt, 0, 23);
    stroke('black');
    line(0,3,0,10);
   
  });
  
  p5axis.drawConnectingLine(function(startX, endX) {
    stroke('black');
    strokeWeight(2);
    line(startX, 0, endX, 0);
  });

  
  pop();
  
}


function keyPressed() {
  arrowMap[LEFT_ARROW] = -1;
  arrowMap[RIGHT_ARROW] = 1;
  spriteDir = arrowMap[keyCode];
  targetIndex = spriteIndex + spriteDir;
  spriteTarget = {
    x:lines[targetIndex].getPositionX(), 
    y:lines[targetIndex].getPositionY()};

  // if (block.getVelocityX() !== 0 && !sameDir) {
  //   console.log('asdadassad')
  //   block.setVelocityX(0) 
  //   // spr.setSpeed(0);
  // } else {
  //   console.log('a')
  //   block.setVelocityX(arrowMap[keyCode]*4) 
  //   // spr.setSpeed(.4, arrowMap[keyCode]);
  // }
  // arrowMap[LEFT_ARROW] = -1;
  // arrowMap[RIGHT_ARROW] = 1;
  // var sameDir = Math.sign(block.getVelocityX()) === arrowMap[keyCode];
  // block.freeze();
  // block.setVelocityX(arrowMap[keyCode]*4) 
  // block.unfreeze();

}


function draw() {
  // put the drawing code here
  background(255);

  fill(127);
  ball.show();
  block.show();
  axes();
  // image(moonImg, moon.getPositionX(), moon.getPositionY());
  for (var i = lines.length - 1; i >= 0; i--) {
    lines[i].show();
  }
  if (spriteDir*block.getPositionX()<spriteDir*spriteTarget.x) {
    // console.log('asdasd')
    block.unfreeze()
    block.setVelocityX(spriteDir*0.7) 
  } else if (spriteDir*block.getPositionX() > spriteDir*spriteTarget.x && !block.isFrozen()) {
    // console.log('asdasd12312')
    spriteIndex = targetIndex;
    block.freeze();
  }

  fill(255);
  // ball.show();
}
