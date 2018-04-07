// Variables
var pauseGame = false; // Keeps track of game if paused
var myGamePiece = []; // Array of game pieces
var clickableAreaArray = [];  // Array of clickable areas
var height;
var width;
var x;
var y;
var color;
var isPaused = document.getElementById("is_paused");
var rndmNum = 0;
var globalScore = 0;  // Score of the game
var lives = 5; // Numer of lives until gameover
var gameOver = false;  // Is it gamover?
var ifClicked = false; // Was the box clicked before new randNum?
var livesP = document.getElementById('lives');  // Graps <p> with id="lives"

// Initially print the lives #
livesP.innerHTML = " " + lives;

// --GAME PAUSE HANDLING--
// Listens for user pressing P key
// If true, run togglePause()
window.addEventListener('keydown', function(e) {
  var key = e.keyCode;
  if (key===80) { // Denotes the 'p' key
    togglePause();
  }
});

// Handles game pause event
function togglePause() {
  if (pauseGame!=true) {
    pauseGame = true;
    console.log("Game paused");
    isPaused.innerHTML = "Game paused";
  } else if (pauseGame==true) {
    pauseGame = false;
    console.log("Game not paused");
    isPaused.innerHTML = "Game not paused";
  }
}

function playGame() {
  pauseGame = false;
}
// --END OF GAME PAUSE HANDLING--

function gameOverFunc() {
  if(lives == 0) {
    gameOver = true;
    togglePause();
    var gOverP = document.getElementById("game-over");
    gOverP.innerHTML = "GAME OVER";
    gOverP.style.backgroundColor = "red";
    lives = 5;
  }
}
// Function to start the game
function startGame() {
  // Set up game area
  // Variable to keep track of score
  var globalScore = 0;
  // Use component constructor to create 4 squares
  myGamePiece[0] = new component(60, 60, "red", 150, 280);
  myGamePiece[1] = new component(60, 60, "red", 270, 280);
  myGamePiece[2] = new component(60, 60, "red", 390, 280);
  myGamePiece[3] = new component(60, 60, "red", 510, 280);
  // Initialize an array of clickableArea objects
  clickableAreaArray[0] = new clickableArea(60, 60, 150, 280);
  clickableAreaArray[1] = new clickableArea(60, 60, 270, 280);
  clickableAreaArray[2] = new clickableArea(60, 60, 390, 280);
  clickableAreaArray[3] = new clickableArea(60, 60, 510, 280);
  // Create the ground
  ground = new component(720, 200, "blue", 0, 280);
  myGameArea.start();
}


// This is an object
var myGameArea = {
  // Create a canvas object
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 720;    // Set canvas width
    this.canvas.height = 480;   // Set canvas height
    this.canvas.addEventListener('mousedown', onDown, false);
    this.context = this.canvas.getContext("2d");
    // inserts canvas as the first childnode of the body element
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // Updates game area every 20th millisecond (50 frames per second)
    this.interval = setInterval(updateGameArea, 20);
    this.intervalRandNum = setInterval(rndmNumFunc, 3000);
  },
  // This is a method to clear the canvas
  // It might seem unnecessary to clear the game area at every update. However, if we leave out the clear() method, all movements of the component will leave a trail of where it was positioned in the last frame:
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// This allows the pieces to move
function movePiece(myGamePiece) {
  if (myGamePiece.y<200) {
    myGamePiece.speedY += 0.5;
  } else {
    myGamePiece.speedY -= 0.5;
  }
}
// This allows the area pieces to move
function moveAreaPiece(clickAble) {
  if (clickAble.y<200) {
    clickAble.speedY += 0.5;
  } else {
    clickAble.speedY -= 0.5;
  }
}

// Funtion to choose a random red box to move up then down
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Pick a random number from 1 - 4  
function rndmNumFunc(){
  if(pauseGame == 0){
    if (ifClicked == false)
      lives = lives - 1;
    gameOverFunc();
    rndmNum = getRandomInt(4);
    console.log("Random number is: " + rndmNum);
    livesP.innerHTML = " " + lives;
    // Reset ifClicked when new object chosen randomly
    ifClicked = false;
  }
}
// Constructor to create a red block
function component(width, height, color, x, y, type) {
  // this.maxHeight = false;
  this.width = width;           // Width of the block
  this.height = height;         // Height of block
  this.x = x;                   // x coordinate
  this.y = y;                   // y coordinate
  this.speedY = 0;
  this.type = type;             // What kind of component?
  // If the component type is 'text', do this
  if (this.type == "text") {
    ctx.font = this.width + " " + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);
  } 
  // component has an update method of its own
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
      this.y += this.speedY;
  }
}
// Constructor to create clickable area
function clickableArea(width, height, x, y, type) {
  this.width = width;           // Width of the block
  this.height = height;         // Height of block
  this.x = x;                   // x coordinate
  this.y = y;                   // y coordinate
  this.speedY = 0;              // To move along y axis
  
  // Area has an update method of its own
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.y += this.speedY;
  }
}
// Updates game area every 20th millisecond (50 frames per second)
function updateGameArea() {
  if (pauseGame==false) {
    myGameArea.clear();     // myGame calls method to clear the canvas
    // myGamePiece.y += 1;
    // Moves pieces
    // for (var i=0; i<myGamePiece.length; i++) {
    //   movePiece(myGamePiece[i]);
    // }
    // for (var i=0; i<myGamePiece.length; i++) {
    //   myGamePiece[i].newPos();
    // }
    // // Populate the canvas with squares
    // for (var j=0; j<myGamePiece.length; j++) {
    //   myGamePiece[j].update();    // myGame calls method to update the canvas
    // }
    movePiece(myGamePiece[rndmNum]);  
    myGamePiece[rndmNum].newPos();
    myGamePiece[rndmNum].update();
    
    moveAreaPiece(clickableAreaArray[rndmNum]);  
    clickableAreaArray[rndmNum].newPos();
    clickableAreaArray[rndmNum].update();
    ground.update();         // myGame calls method to update the canvas
    // Update the score on the screen
  }
}
// It takes the mousedown event as a parameter,
// The event has proporties
// pageX is the x coordinate of the canvas clicked
// pagey is the y coordinate of the canvas clicked
function onDown(event){
  var cx = event.pageX;
  var cy = event.pageY;
  var xBound_1 = clickableAreaArray[rndmNum].x;
  var xBound_2 = clickableAreaArray[rndmNum].x + clickableAreaArray[rndmNum].width;
  var yBound_1 = clickableAreaArray[rndmNum].y;
  var yBound_2 = clickableAreaArray[rndmNum].x + clickableAreaArray[rndmNum].height;

  // Target span with ID="score"
  var scoreP = document.getElementById('score');
  // Print information in console
  console.log("X,Y = " + cx + ', ' + cy);
  // If the click is within thei x,y coordinate, update score
  if (cx <= xBound_2 && cx >= xBound_1 && cy <= yBound_2 && cy >= yBound_1 && ifClicked == false) {
    globalScore = globalScore + 1;
    ifClicked = true;
    // Clear the previous printed score
    scoreP.innerHTML = "";
    console.log("score: " + globalScore);
    // Print new score in span tag
    scoreP.innerHTML = " " + globalScore;
  }
}