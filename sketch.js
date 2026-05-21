//create the variables 
let ghost;
let obstacles;

let isGameOver = false;
let hasGameBegun = false;
let score = 0;

let minDistanceBetweenObstacles;
let nextSpawnDistance;

//sprites
let ghostSprite;

let graveSprites = [];
let vineSprites = [];

//where images will be added in future (not sure if this is correct way to do)
function preload() {
  ghostSprite = loadImage('');

  graveSprites[0] = loadImage('');
  graveSprites[1] = loadImage('');
  graveSprites[2] = loadImage('');
  graveSprites[3] = loadImage('');

  vineSprites[0] = loadImage('');
  vineSprites[1] = loadImage('');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  minDistanceBetweenObstacles = width / 3;

  resetGame();

  noLoop();

  document.getElementById('startBtn').addEventListener('click', startGameFromButton);

}

function startGameFromButton() {
  //difficulty
  if (document.getElementById('easy').checked) difficulty = 'easy';
  if (document.getElementById('medium').checked) difficulty = 'medium';
  if(document.getElementById('hard').checked) difficulty = 'hard';

  //hide all the stuff on the start screen
  document.getElementById('easy').hidden = true
  document.getElementById('medium').hidden = true
  document.getElementById('hard').hidden = true

  document.getElementById('easyLabel').hidden = true
  document.getElementById('mediumLabel').hidden = true
  document.getElementById('hardLabel').hidden = true

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

  ghost = new Ghost(120, height / 2);
  obstacles = [new Obstacle()];
  nextSpawnDistance = random(minDistanceBetweenObstacles, width - width / 4);
}

function draw() {
  background(15, 15, 35);

  for (let i = 0; i < 50; i++) { 
    fill("white"); 
    circle(random(width), random(height), 2); 
  }


  if (obstacles.length <= 0 || width - obstacles[obstacles.length - 1].x >= nextSpawnDistance) {
    obstacles.push(new Obstacle());
    nextSpawnDistance = random(minDistanceBetweenObstacles, width - width / 5);
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].draw();

    if (obstacles[i].checkIfHitsGhost(ghost)) {
      isGameOver = true;
      noLoop();
    }

    if (!obstacles[i].pastGhost && obstacles[i].checkIfPastGhost(ghost)) {
      score++;
    }

    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }

  ghost.update();
  ghost.draw();
  drawScore();
}

function drawScore() {
  fill("white");
  textAlign(LEFT);
  textSize(28);
  text('Score: ' + score, 20, 40);

  if (isGameOver) {
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(60);
    fill("red");
    text('Game Over!', width / 2, height / 3);

    fill('white');
    textSize(30);
    text('Press Space Bar or Start to play again.', width / 2, height / 2+20);
    text("Final Score: " + score, width / 2, height / 2 - 40);
  
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  minDistanceBetweenObstacles = width / 3;
  ghost.y = contrain(ghost.y, 0, height);
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

class Ghost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.vel = createVector(0, 0);
    this.gravity = 0.35;
    this.lift = -7;
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

    image(
      ghostSprite,
      this.x,
      this.y,
      this.size * 2,
      this.size * 2,
    );
  }
  

  flap() {
    if (!isGameOver) {
      this.vel.y = this.lift;
    }
  }
}

class Obstacle {
  constructor() {
    if (difficulty === 'easy') {
      this.spacing = 190;
      this.speed = 2;
    }
    if (difficulty === 'medium') {
       this.spacing = 150;
       this.speed = 3;
    }
    if (difficulty === 'hard') {
      this.spacing = 120;
      this.speed = 4;
    }

    this.top = random(60, height - this.spacing - 60);
    this.bottom = height - this.top - this.spacing;
    this.x = width;
    this.width = 90;

    this.pastGhost = false;
    this.graveSprite = random(graveSprites);
    this.vineSprite = random(vineSprites);
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

