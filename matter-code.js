
//matter
var ball;
var block;
var floor;

var prices = [2.99, 4.00, 1.00, 3.5];
var interval = 1;
//  Lines are divided into this many total parts, so that each can be partially destroyed
var totalSegments = 20;
var segmentLineBy = Math.max(1,totalSegments/prices.length);
var morePrices = interpolateBetween(prices,100)
// var numLineParts = totalSegments/
var lines = [];
var clicked = [];


function findCurrentLine(ball) { 
	var posX = ball.body.position.x
	return lines.filter(function(x){
		return x.body.bounds.min.x<posX && x.body.bounds.max.x>posX
	})[0]
}

function interpolateBetween(arr, howMany) {
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

function centerLine(x1,y1,x2,y2) {
  var centerX = (x1+x2)/2, centerY = (y1+y2)/2
  var width = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2))
  var radians = Math.atan((y2-y1)/(x2-x1))
  return [centerX, centerY, width, radians]
}

function lineChart() {
  var lastPrice = height - map(morePrices[0], 0, 5, 0, 100);
  var x1 = 0;
  for (var i=1; i<morePrices.length; i++) {
    x1 = (i-1)*interval;
    adjustedPrice = height - map(morePrices[i], 0, 5, 0, 100);
    if (clicked.indexOf(x1) < 0) {
      centered = centerLine(
        x1, 
        lastPrice, 
        i*interval, 
        adjustedPrice
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
