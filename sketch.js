let motivationalQuotes = [
  "Everyone is unique and perfect in their own way!",
  "Your circle is as unique as you are!",
  "Embrace imperfection, that's what makes you special!",
  "Perfection is overrated; you are extraordinary!",
  "Every attempt is a step toward greatness!",
  "Your creativity is what makes the world brighter!",
  "Every circle tells its own story—yours is amazing!",
  "There's beauty in every imperfection you create!",
  "Perfection is an illusion—your uniqueness is real!",
  "In art, there are no mistakes, only masterpieces!",
  "Your circle, like you, is one of a kind!",
  "Greatness lies in embracing what makes you different!",
  "Your effort is what makes your circle truly perfect!",
  "No two circles are the same, just like no two people!",
  "Every line you draw adds to your beautiful journey!",
];
let centerX, centerY, avgRadius, score;
let currentQuote;
let drawing = false;
let points = [];
let showResult = false;
let currentColor = [0, 0, 0]; // Default color
let backgroundColor = [255, 255, 255]; // Default background color
let greyscale = true; // Greyscale mode flag
let sound; // Variable to store the sound
let pixelate; // Variable to store the pixalate effect
let highestScore = 0;
let backgroundImg;
let confettiParticles = [];

function preload() {
  pixelate = loadFont("libraries/SF Pixelate.ttf");
  sound = loadSound(
    "libraries/Sleeping & Ambient (Music For Videos) - Jul by Scott Buckley.mp3"
  );
  backgroundImg = loadImage("libraries/BG.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  textFont(pixelate);
  textSize(24);
  textAlign(CENTER, CENTER);
  currentQuote = random(motivationalQuotes);
  resetGame();
}

function draw() {
  drawBackground();

  if (drawing) {
    // Draw the current circle as the player moves
    noFill();
    stroke(currentColor);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y);
    }
    endShape();
  }

  if (showResult) {
    // Display the score in the center when drawing is finished
    displayResult();
  } else {
    // Only display instructions while drawing or waiting for input
    displayInstructions();
  }
  // Update highest score
  if (score > highestScore) {
    highestScore = score;
  }
  if (confettiParticles.length > 0) {
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      confettiParticles[i].update();
      confettiParticles[i].display();
      if (confettiParticles[i].y > height) {
        confettiParticles.splice(i, 1); // Remove confetti particle if it goes off screen
      }
    }
  }
}

function drawBackground() {
  if (greyscale) {
    background(200); // Light grey background
    fill(100); // Dark grey fill for squares
  } else {
    background(backgroundColor);
    fill(currentColor);
  }
  if (backgroundImg) {
    let imgAspect = backgroundImg.width / backgroundImg.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight;

    if (canvasAspect > imgAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
    } else {
      drawWidth = height * imgAspect;
      drawHeight = height;
    }

    // Calculate the y position to draw the image at the bottom
    let yPos = height - drawHeight;
    image(backgroundImg, 0, yPos, drawWidth, drawHeight);
  } else {
    background(backgroundColor);
  }
  noStroke();
}

function displayInstructions() {
  fill(0);
  textFont(pixelate);
  text("Try to draw a circle!", width / 2, height / 2 + 400);
}

function displayResult() {
  fill(0);
  textFont(pixelate);
  textSize(32);
  textAlign(CENTER, CENTER); // Ensure text is centered
  text("SCORE: " + score, width / 2, height / 2 + 350); // Display score in the center
  textSize(24);
  text("Click anywhere to try again!", width / 2, height / 2 + 400);
  textFont("Playwrite CU");
  displayQuote(); // Display the motivational quote
  move(); // Move the progress bar
}

function displayQuote() {
  fill(0);
  if (score === 100) {
    text("You are a CIRCLE!", width / 2, height / 2); // Display special message for perfect score
    if (confettiParticles.length === 0) {
      for (let i = 0; i < 100; i++) {
        confettiParticles.push(new Confetti(width / 2, height / 2));
      }
    }
  } else if (isNaN(score)) {
    text("You are a SQUARE!", width / 2, height / 2); // Display special message for NaN score
  } else {
    text(currentQuote, width / 2, height / 2); // Center the quote
  }
}

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.color = [...currentColor, 100]; // Lower opacity
    this.velocity = {
      x: random(-5, 5),
      y: random(-10, -2),
    };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.1; // Gravity effect
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function mousePressed() {
  if (showResult) {
    resetGame();
  } else {
    drawing = true;
    points = [];
  }
}

function mouseDragged() {
  if (drawing) {
    points.push({ x: mouseX, y: mouseY });
  }
}

function mouseReleased() {
  if (drawing) {
    drawing = false;
    calculateScore();
  }
}

function resetGame() {
  score = 0;
  points = [];
  centerX = 0;
  centerY = 0;
  avgRadius = 0;
  showResult = false; // Reset the result display flag
  currentQuote = random(motivationalQuotes);
  background(255);
}

function calculateScore() {
  // Step 1: Calculate the center of the drawn points (centroid)
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < points.length; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
  }
  centerX = sumX / points.length;
  centerY = sumY / points.length;

  // Step 2: Calculate the average radius from the center to each point
  let totalRadius = 0;
  for (let i = 0; i < points.length; i++) {
    let distance = dist(points[i].x, points[i].y, centerX, centerY);
    totalRadius += distance;
  }
  avgRadius = totalRadius / points.length;

  // Step 3: Calculate the deviation and standard deviation
  let totalDeviation = 0;
  let squaredDeviations = 0;
  for (let i = 0; i < points.length; i++) {
    let distance = dist(points[i].x, points[i].y, centerX, centerY);
    let deviation = abs(distance - avgRadius);
    totalDeviation += deviation;
    squaredDeviations += deviation * deviation; // For variance calculation
  }

  let variance = squaredDeviations / points.length;
  let standardDeviation = sqrt(variance);

  // Step 4: Map the score with consideration of the standard deviation for more precision
  score = round(map(standardDeviation, 0, avgRadius, 100, 0));

  showResult = true; // Set showResult to true to display the result
}

function keyPressed() {
  if (key === "1") {
    currentColor = [255, 0, 0]; // Red
    backgroundColor = [255, 200, 200]; // Light Red
    greyscale = false;
  } else if (key === "2") {
    currentColor = [0, 255, 0]; // Green
    backgroundColor = [200, 255, 200]; // Light Green
    greyscale = false;
  } else if (key === "3") {
    currentColor = [0, 0, 255]; // Blue
    backgroundColor = [200, 200, 255]; // Light Blue
    greyscale = false;
  } else if (key === "4") {
    currentColor = [204, 204, 0]; // Yellow
    backgroundColor = [255, 255, 200]; // Light Yellow
    greyscale = false;
  } else if (key === "5") {
    greyscale = true;
    currentColor = [0, 0, 0]; // Black
  }
  // Special key to cheat the game for Process Journal Document
  if (key === "@") {
    score = 100;
  }
  if (key === "m") {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.play();
    }
  }
}

function move() {
  var elem = document.getElementById("myBar");

  if (elem) {
    // Set the width of the progress bar to match the highest score percentage
    var width = highestScore;
    elem.style.width = width + "%";
  }
}

document.addEventListener("keypress", function (event) {
  const myBar = document.getElementById("myBar");

  switch (event.key) {
    case "1":
      myBar.style.backgroundColor = "rgb(255, 0, 0)";
      document.documentElement.style.setProperty(
        "--currentColor",
        "rgb(255, 0, 0)"
      ); // Update footer color
      break;
    case "2":
      myBar.style.backgroundColor = "rgb(0, 255, 0)";
      document.documentElement.style.setProperty(
        "--currentColor",
        "rgb(0, 255, 0)"
      ); // Update footer color
      break;
    case "3":
      myBar.style.backgroundColor = "rgb(0, 0, 255)";
      document.documentElement.style.setProperty(
        "--currentColor",
        "rgb(0, 0, 255)"
      ); // Update footer color
      break;
    case "4":
      myBar.style.backgroundColor = "rgb(204, 204, 0)";
      document.documentElement.style.setProperty(
        "--currentColor",
        "rgb(204, 204, 0)"
      ); // Update footer color
      break;
    case "5":
      myBar.style.backgroundColor = "rgb(151, 151, 151)";
      document.documentElement.style.setProperty(
        "--currentColor",
        "rgb(151, 151, 151)"
      ); // Update footer color
      break;
    default:
      break;
  }
});

// Default to case 5 when preload
window.addEventListener("load", function () {
  const myBar = document.getElementById("myBar");
  myBar.style.backgroundColor = "rgb(151, 151, 151)";
  document.documentElement.style.setProperty(
    "--currentColor",
    "rgb(151, 151, 151)"
  ); // Update footer color
});

// Add event listener to loop the music
sound.addEventListener("ended", function () {
  sound.play();
});
