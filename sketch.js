

let bird;
let pipes;
let isGameOver = false;
let hasGameBegun = false;
let score = 0;

let minDistanceBetweenPipes;
let nextSpawnDistance;

function setup() {
  createCanvas(windowWidth, windowHeight);
  minDistanceBetweenPipes = width / 3;

  resetGame();

  // stop game loop until the player starts
  noLoop();

  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startGameFromButton);
    }
}

function startGameFromButton() {
    document.getElementById('easy').hidden = true
    document.getElementById('medium').hidden = true
    document.getElementById('hard').hidden = true
    document.getElementById('startBtn').hidden = true
    document.getElementById('startMsg').hidden = true
  if (!hasGameBegun || isGameOver) {
    resetGame();
    hasGameBegun = true;
    loop();
  }
}

function resetGame() {
  score = 0;
  isGameOver = false;

  bird = new Bird(64, height / 2);
  pipes = [new Pipe()];
  nextSpawnDistance = random(minDistanceBetweenPipes, width - width / 4);
}

function draw() {
  background(220);

  if (pipes.length <= 0 || width - pipes[pipes.length - 1].x >= nextSpawnDistance) {
    pipes.push(new Pipe());
    nextSpawnDistance = random(minDistanceBetweenPipes, width - width / 5);
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].draw();

    if (pipes[i].checkIfHitsBird(bird)) {
      isGameOver = true;
      noLoop();
    }

    if (pipes[i].pastBird === false && pipes[i].checkIfPastBird(bird)) {
      score++;
    }

    if (pipes[i].x + pipes[i].width < 0) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.draw();
  drawScore();
}

function drawScore() {
  fill(0);
  textAlign(LEFT);
  textSize(15);
  text('Score: ' + score, 10, 20);

  if (isGameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(50);
    fill(255);
    text('GAME OVER!', width / 2, height / 3);

    textSize(30);
    text('Press SPACE BAR or Start to play again.', width / 2, height / 2);
  } else if (!hasGameBegun) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(18);
    fill(255);
    text('Click Start to begin!', width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === ' ') {
    if (isGameOver) {
      resetGame();
      hasGameBegun = true;
      loop();
    } else if (!hasGameBegun) {
      hasGameBegun = true;
      loop();
      bird.flap();
    } else {
      bird.flap();
    }
  }
}

class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32;
    this.vel = createVector(0, 0);
    this.gravity = 0.3;
    this.lift = -6;
  }

  update() {
    this.vel.y += this.gravity;
    this.y += this.vel.y;

    if (this.y > height - this.size / 2) {
      this.y = height - this.size / 2;
      this.vel.y = 0;
      isGameOver = true;
      noLoop();
    }

    if (this.y < this.size / 2) {
      this.y = this.size / 2;
      this.vel.y = 0;
    }
  }

  draw() {
    fill(255, 204, 0);
    stroke(0);
    ellipse(this.x, this.y, this.size);
  }

  flap() {
    if (!isGameOver) {
      this.vel.y = this.lift;
    }
  }
}

class Pipe {
  constructor() {
    this.spacing = 120;
    this.top = random(40, height - this.spacing - 40);
    this.bottom = height - this.top - this.spacing;
    this.x = width;
    this.width = 50;
    this.speed = 3;
    this.pastBird = false;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    fill(34, 139, 34);
    noStroke();
    rect(this.x, 0, this.width, this.top);
    rect(this.x, height - this.bottom, this.width, this.bottom);
  }

  checkIfHitsBird(bird) {
    const hitX = bird.x + bird.size / 2 > this.x && bird.x - bird.size / 2 < this.x + this.width;
    if (!hitX) return false;
    return bird.y - bird.size / 2 < this.top || bird.y + bird.size / 2 > height - this.bottom;
  }

  checkIfPastBird(bird) {
    if (!this.pastBird && bird.x > this.x + this.width) {
      this.pastBird = true;
      return true;
    }
    return false;
  }
}

