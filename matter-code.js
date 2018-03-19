
//matter
var ball;
var block;
var floor;

function checkBoundaries() {
  var pos = block.getPositionX();
  if ((pos < margin && spriteDir === -1 && !block.isFrozen())
    || (pos > width - margin && spriteDir === 1 && !block.isFrozen())) {
    spriteDir = 0;
    block.freeze();
  } else if (spriteDir === 1 || spriteDir === -1) {
    block.unfreeze()
    block.setVelocityX(spriteDir*0.7) 
  }
}

var prices = [2.99, 4.00, 1.00, 3.5];
var interval = 100;
//  Lines are divided into this many total parts, so that each can be partially destroyed
var totalSegments = 1;
var segmentLineBy = Math.max(1,totalSegments/prices.length);
// var numLineParts = totalSegments/
var lines = [];
var clicked = [];

function centerLine(x1,y1,x2,y2) {
  var centerX = (x1+x2)/2, centerY = (y1+y2)/2
  var width = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2))
  var radians = Math.atan((y2-y1)/(x2-x1))
  return [centerX, centerY, width, radians]
}

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
