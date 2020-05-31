// The canvas range. It will change once zoom in/out is applied
var currentXRange = [-2.5, 2.5];
var currentYRange = [-2.5, 2.5];

// Determines how much "zoom" will be applied
const zoomRate = 0.25

// Function executed when the mouse button is pressed
function mousePressed(event) {
  if (mouseX > 500 || mouseX < 0 || mouseY > 500 || mouseY < 0) {
    return;
  }

  // convert the clicked position to the range in XRange and YRange
  var a = map(mouseX, 0, width, currentXRange[0], currentXRange[1]);
  var b = map(mouseY, 0, height, currentYRange[0], currentYRange[1]);

  // get the canvas width and height
  totalRangeX = currentXRange[1] - currentXRange[0];
  totalRangeY = currentYRange[1] - currentYRange[0];

  // if user press left click
  if (event.button === 0) {
    // apply zoom in
    currentXRange = [a - totalRangeX * zoomRate, a + totalRangeX * zoomRate]
    currentYRange = [b - totalRangeY * zoomRate, b + totalRangeY * zoomRate]
  } else {
    // apply zoom out
    currentXRange = [a - totalRangeX/2 - totalRangeX * zoomRate, a + totalRangeX/2 + totalRangeX * zoomRate]
    currentYRange = [b - totalRangeY/2 - totalRangeY * zoomRate, b + totalRangeY/2 + totalRangeY * zoomRate]
  }
  
  // update the canvas
  draw()
}

function setup() {
  // crate the canvas
  var canvas = createCanvas(500, 500);

  //attach canvas to a div
  canvas.parent("sketch-holder");

  // determines how many pixels the canvas will have
  pixelDensity(1);
}

function mandelbrotFunc (a,b) {
  var aa = a * a - b * b;
  var bb = 2 * a * b;

  return [aa, bb];
}

// Draw the canvas
function draw() {
  // number of iterations for the mandelbrot function
  var maxiterations = 200;

  // Loads the pixel data for the display window into the pixels[] array.
  loadPixels();
  // Iterate over every single pixel in canvas
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      // convert the clicked position to the range in XRange and YRange
      var a = map(x, 0, width, currentXRange[0], currentXRange[1]);
      var b = map(y, 0, height, currentYRange[0], currentYRange[1]);

      // The "c" in the mandelbrot formula
      var ca = a;
      var cb = b;

      var n = 0;

      // Iterate the mandelbrotFunc
      while (n < maxiterations) {
        var [aa, bb] = mandelbrotFunc(a, b);
        a = aa + ca;
        b = bb + cb;
        if (a * a + b * b > 16) {
          break;
        }
        n++;
      }

      // Set the color schema
      var bright = map(n, 0, maxiterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);
      if (n == maxiterations) {
        bright = 0;
      }

      // fill the pixels
      var pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }

  // Update the current canvas with the filled pixels
  updatePixels();

  // avoid infinite loop
  noLoop();
}
