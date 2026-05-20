// let gameState = "startScreen"; 
// let ghost;

// let vines; 
// let gravestones;

// let score = 0; 
// let gameSpeed = 1; 
// let obstacleTimer = 0; 

// //Will add images from Piskel
// let ghostImg; 
// let gravestoneImg; 

// function images() {
//     ghostImg = loadImage(""); 
//     gravestoneImg = loadImage(""); 
//     backgroundImg = loadImage("");
//  }

// function setup() {
//     new Canvas(800, 500); 
 
//     gravestones = new Group(); 
//     vines = new Group(); 
//     gravestonesTop.collider = "static"; 
//     createGhost(); 
// } 


// function startGame() { 
//     gameState = "play"; 
//     score = 0; 
//     ghost.x = 150; 
//     ghost.y = 250; 
//     ghost.vel.y = 0; 
//     gravestones.removeAll(); 
//     vines.removeAll(); }

// document.getElementById('startBtn').addEventListener("click", function() {
//         document.getElementById("easy").hidden = true;
//             startGame();
            
//        });



// await Canvas();
// world.gravity.y = 10;

// let ball = new Sprite();
// ball.diameter = 50;
// ball.img = '🤪';

// let groundA = new Sprite();
// groundA.x = -120;
// groundA.width = 220;
// groundA.rotation = 30;
// groundA.physics = STATIC;

// let groundB = new Sprite();
// groundB.x = 120;
// groundB.width = 220;
// groundB.rotation = -30;
// groundB.physics = STATIC;

// q5.update = function () {
// 	background('skyblue');
// 	text('click to jump!', 0, -50);

// 	if (mouse.presses()) ball.vel.y = -5;
// };

let bird;
let pipes;
let isGameOver = false;
let hasGameBegun = false; 
let score = 0;
let arcadeFont;

let minDistanceBetweenPipes;
let nextSpawnDistance;

function preload() {
  arcadeFont = loadFont('assets/arcadefont.ttf');
}

function setup() {
  createCanvas(600, 400);
  minDistanceBetweenPipes = width / 3;
  textFont(arcadeFont); 
  
  resetGame();
  
  // stop game loop until space bar hit to begin
  noLoop();
  
  // Add click listener to start button
  document.getElementById('startBtn').addEventListener('click', startGameFromButton);
}

function startGameFromButton() {
  if (!hasGameBegun) {
    hasGameBegun = true;
    loop();
  }
}

function resetGame(){
  score = 0;
  isGameOver = false; 
  
  bird = new Bird(64, height / 2);
  pipes = [new Pipe()];
  nextSpawnDistance = random(minDistanceBetweenPipes, width - width/4);
}

function draw() {
  background(220);
  
  // this controls how often we spawn new pipes. 
  // if(frameCount % 80 == 0){ 
  //   pipes.push(new Pipe()); 
  // }
  
  if(pipes.length <= 0 || width - pipes[pipes.length - 1].x >= nextSpawnDistance){
    pipes.push(new Pipe()); 
    nextSpawnDistance = random(minDistanceBetweenPipes, width - width/5);
  }
  
  // loop through all the pipes and update them
  for(let i = pipes.length - 1; i >= 0; i--){
    pipes[i].update();
    pipes[i].draw();
    
    // if we hit the pipe, end game
    if(pipes[i].checkIfHitsBird(bird)){
      isGameOver = true;
      noLoop(); // game is over, stop game loop
    }
    
    // if we successfully pass the pipe, increase the score
    if(pipes[i].pastBird === false && pipes[i].checkIfPastBird(bird)){
      score++;
    }
    
    // remove pipes that have gone off the screen
    if(pipes[i].x + pipes[i].width < 0){
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
  text('Score:' + score, 10, 20);

  if (isGameOver) {

    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // draw game over text
    textAlign(CENTER);
    textSize(35);
    fill(255);
    text('GAME OVER!', width / 2, height / 3);
    
    textSize(12);
    text('Press SPACE BAR to play again.', width / 2, height / 2);
  }else if(hasGameBegun == false){
    // if we're here, then the game has yet to begin for the first time
    
    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // draw game over text
    textAlign(CENTER);
    textSize(15);
    fill(255);
    text('Press SPACE BAR to play!', width / 2, height / 3);
  }
 
}

function keyPressed(){
  if (key == ' '){ // spacebar 
    bird.flap();
  }
  
  // check for special states (game over or if game hasn't begun)
  if (isGameOver == true && key == ' ') {
    resetGame();
    hasGameBegun = true;
    loop();
  }else if(hasGameBegun == false && key == ' '){
    hasGameBegun = true;
    loop();
  }
}

