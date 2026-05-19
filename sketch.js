let gameState = "startScreen"; 
let ghost;

let vines; 
let gravestones;

let score = 0; 
let gameSpeed = 1; 
let obstacleTimer = 0; 

//Will add images from Piskel
let ghostImg; 
let gravestoneImg; 

function images() {
    ghostImg = loadImage(""); 
    gravestoneImg = loadImage(""); 
    backgroundImg = loadImage("");
 }

function setup() {
    new Canvas(800, 500); 
 
    gravestones = new Group(); 
    vines = new Group(); 
    gravestonesTop.collider = "static"; 
    createGhost(); 
} 

function startGame() { 
    gameState = "play"; 
    score = 0; 
    ghost.x = 150; 
    ghost.y = 250; 
    ghost.vel.y = 0; 
    gravestones.removeAll(); 
    vines.removeAll(); }

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
