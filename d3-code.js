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


function axes() {
  
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