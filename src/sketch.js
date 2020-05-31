var minval = -0.5;
var maxval = 0.5;

var frDiv;

var chk1;
var chk2;

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

  radio = createRadio();
  radio.option("x", "func1");
  radio.option("xˆ2", "func2");
  radio.option("xˆ3", "func3");
  radio.option("xˆ4", "func4");
  radio.value("func1");

  radio.style("width", "200px");
  radio.style("color", "white");
  radio.position(19, 19);

  button = createButton("render");
  button.position(19, 100);
  button.mousePressed(() => {
    toggleLoading(true);
    setTimeout(() => {
      draw();
      toggleLoading(false);
    }, 200);
  });
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
      var a = map(x, 0, width, -2.5, 2.5);
      var b = map(y, 0, height, -2.5, 2.5);

      var ca = a;
      var cb = b;

      var n = 0;

      while (n < maxiterations) {
        var [aa, bb] = functions[radio.value()](a, b);
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
