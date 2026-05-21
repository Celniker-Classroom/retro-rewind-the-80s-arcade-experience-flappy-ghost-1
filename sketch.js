//create the variables 
let ghost;
let obstacles;

let isGameOver = false;
let hasGameBegun = false;
let score = 0;

let difficulty = 'medium';
let gameSpeedMultiplier = 1;



let minDistanceBetweenObstacles;
let nextSpawnDistance;

//sprites
let ghostSprite;

let graveSprites = [];
let vineSprites = [];

let stars = [];

console.log('sketch.js loaded');

//where images will be added in future (not sure if this is correct way to do )
function preload() {
  ghostSprite = loadImage('images/ghost.png');

  graveSprites[0] = loadImage('images/smallgrave.png');
  graveSprites[1] = loadImage('images/mediumgrave.png');
  graveSprites[2] = loadImage('images/cross.png');
  graveSprites[3] = loadImage('images/bigcross.png');

  vineSprites[0] = loadImage('images/vine1.png');
  vineSprites[1] = loadImage('images/vine2.png');

}


function setup() {
  console.log('setup called');
  
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  minDistanceBetweenObstacles = width / 3;

  resetGame();

  noLoop();

  const startBtn = document.getElementById('startBtn');
  window.startGameFromButton = startGameFromButton;
  if (startBtn) {
    startBtn.addEventListener('click', startGameFromButton);
    console.log('startBtn listener attached');
  } else {
    console.log('startBtn not found');
  }

  for (let i = 0; i < 50; i++) { 
    stars.push({ 
      x: random(width), 
      y: random(height) 
    }); 
  }

}

function startGameFromButton() {
  console.log('startGameFromButton called');

  if (document.querySelector("h1")) {
    document.querySelector("h1").hidden = true;
  }

  //difficulty
  if (document.getElementById("easy").checked) difficulty = "easy"; 
  if (document.getElementById("medium").checked) difficulty = "medium"; 
  if (document.getElementById("hard").checked) difficulty = "hard";

  if (difficulty === "easy") gameSpeedMultiplier = 1.1; 
  if (difficulty === "medium") gameSpeedMultiplier = 1.2; 
  if (difficulty === "hard") gameSpeedMultiplier = 1.4;

  ["easy", "medium", "hard", "startBtn", "startMsg"].forEach(id => { 
    let el = document.getElementById(id); 
    if (el) el.hidden = true; 
  });

  ["easyLabel", "mediumLabel", "hardLabel"].forEach(id => { 
    let el = document.getElementById(id); 
    if (el) el.hidden = true; 
  });

  


    resetGame();
    hasGameBegun = true;
    isGameOver = false;
    loop();
  }


function resetGame() {
  score = 0;
  isGameOver = false;

  ghost = new Ghost(120, height / 2);
  obstacles = [new Obstacle()];
  nextSpawnDistance = random(minDistanceBetweenObstacles, width);
}

function draw() {
  background(15, 15, 35);

  for (let i = 0; i < stars.length; i++) { 
    fill("white"); 
    circle(stars[i].x, stars[i].y, 2); 
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

    if (obstacles[i].checkIfPastGhost(ghost)) {
      score++;
    }

    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }

  ghost.update();

ghost.draw();

  drawScore();

};
  
function drawScore() {
  fill("white");
  textAlign(LEFT);
  textSize(28);
  text('Score: ' + score, 20, 40);

  if (isGameOver){
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(60);
    fill("red");
    text('Game Over!', width / 2, height / 3);

    fill('white');
    textSize(30);
    text('Press Space Bar to play again.', width / 2, height / 2+20);
    text("Final Score: " + score, width / 2, height / 2 - 40); }
  
  }



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  minDistanceBetweenObstacles = width / 3;
  ghost.y = constrain(ghost.y, 0, height);
  ghost.vel.y = 0;
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
      ghost.flap();
    } else {
      ghost.flap();
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
    if (ghostSprite) {
    image(
      ghostSprite,
      this.x,
      this.y,
      this.size * 2,
      this.size * 2,
    );
  } else {
      fill("white");
      ellipse(this.x, this.y, this.size);
    }
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
      this.speed = 4 * gameSpeedMultiplier;
    }
    if (difficulty === 'medium') {
       this.spacing = 150;
       this.speed = 5 * gameSpeedMultiplier;
    }
    if (difficulty === 'hard') {
      this.spacing = 120;
      this.speed = 6 * gameSpeedMultiplier;
    }

    this.top = random(60, height - this.spacing - 60);
    this.bottom = height - this.top - this.spacing;
    this.x = width;
    this.width = 90;

    this.pastGhost = false;
    this.graveSprite = random(graveSprites);
    this.vineSprite = random(vineSprites);
    this.graveSprite = random(graveSprites.filter(img => img)); 
    this.vineSprite = random(vineSprites.filter(img => img));
    const g = graveSprites.filter(img => img); 
    const v = vineSprites.filter(img => img); 
 
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    imageMode(CORNER);

    if (this.graveSprite) {image(
      this.graveSprite,
      this.x,
      height - this.bottom,
      this.width,
      this.bottom
    ); } else { fill(120); rect(this.x, height - this.bottom, this.width, this.bottom); }

    if (this.vineSprite) {
      image(
      this.vineSprite,
      this.x,
      0,
      this.width,
      this.top
    );  } else {
    fill(120);
    rect(this.x, 0, this.width, this.top);
  }
  }

  checkIfHitsGhost(ghost) {
    let hitX = ghost.x + ghost.size / 2 > this.x && ghost.x - ghost.size / 2 < this.x + this.width;
    if (!hitX) return false;
    return (ghost.y - ghost.size / 2 < this.top || ghost.y + ghost.size / 2 > height - this.bottom);
  }

  checkIfPastGhost(ghost) {
    if (!this.pastGhost && ghost.x > this.x + this.width) {
      this.pastGhost = true;
      return true;
    }
    return false;
  }
}
