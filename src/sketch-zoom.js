var minval = -0.5;
var maxval = 0.5;

var frDiv;

var chk1;
var chk2;

var currentXRange = [-2.5, 2.5];
var currentYRange = [-2.5, 2.5];

const zoomRate = 0.25

function mousePressed(event) {
  if (mouseX > 500 || mouseX < 0 || mouseY > 500 || mouseY < 0) {
    return;
  }

  var a = map(mouseX, 0, width, currentXRange[0], currentXRange[1]);
  var b = map(mouseY, 0, height, currentYRange[0], currentYRange[1]);

  totalRangeX = currentXRange[1] - currentXRange[0];
  totalRangeY = currentYRange[1] - currentYRange[0];

  if (event.button === 0) {
    currentXRange = [a - totalRangeX * zoomRate, a + totalRangeX * zoomRate]
    currentYRange = [b - totalRangeY * zoomRate, b + totalRangeY * zoomRate]
  } else {
    currentXRange = [a - totalRangeX/2 - totalRangeX * zoomRate, a + totalRangeX/2 + totalRangeX * zoomRate]
    currentYRange = [b - totalRangeY/2 - totalRangeY * zoomRate, b + totalRangeY/2 + totalRangeY * zoomRate]
  }
  
  draw()
}

function toggleLoading(isLoading) {
  var sketchHolder = document.getElementById("sketch-holder");
  var loading = document.getElementById("loading-div");
  sketchHolder.style.display = isLoading ? "none" : "block";
  loading.style.display = isLoading ? "block" : "none";
}

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent("sketch-holder");
  pixelDensity(1);
}

var functions = {
  func1: (a, b) => {
    return [a, b];
  },
  func2: (a, b) => {
    var aa = a * a - b * b;
    var bb = 2 * a * b;

    return [aa, bb];
  },
  func3: (a, b) => {
    var aa = Math.pow(a, 3) - 3 * a * Math.pow(b, 2);
    var bb = 3 * Math.pow(a, 2) * b - Math.pow(b, 3);

    return [aa, bb];
  },
  func4: (a, b) => {
    var aa =
      Math.pow(a, 4) - 6 * Math.pow(a, 2) * Math.pow(b, 2) + Math.pow(b, 4);
    var bb = 4 * Math.pow(a, 3) * b - 4 * a * Math.pow(b, 3);

    return [aa, bb];
  },
};

function draw() {
  var maxiterations = 100;

  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var a = map(x, 0, width, currentXRange[0], currentXRange[1]);
      var b = map(y, 0, height, currentYRange[0], currentYRange[1]);

      var ca = a;
      var cb = b;

      var n = 0;

      while (n < maxiterations) {
        var [aa, bb] = functions.func2(a, b);
        a = aa + ca;
        b = bb + cb;
        if (a * a + b * b > 16) {
          break;
        }
        n++;
      }

      var bright = map(n, 0, maxiterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

      if (n == maxiterations) {
        bright = 0;
      }

      var pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }

  updatePixels();

  noLoop();
}
