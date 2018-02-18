const snakeCanvas = document.getElementById('snakeGame');
const c = snakeCanvas.getContext('2d');
let current = document.getElementById('currentScore');
let high = document.getElementById('highScore');
let difficulty = 5;
let snakePositions = []; //all positions of snake stored here
let tail = 5;//initial length of snake
let xv = 1;//initial x velocity
let yv = 0;//initial y velocity
let playerX = 10 //initial player x coordinate
let playerY = 10; //initial player y coordinate
let gridSize = 20; //size of grid squares
let tileCount = 20; //number of tiles in grid
let appleX =  15; //initial apple x coordinate
let appleY =  15; //initial apply y coordinate
let gameInterval; //variable for clearing game interval
let highScore = 0;
let currentScore = tail - 5;


//function to initialize the start state of the game
function initialize() {  
  //creating the start button
  high.innerHTML = highScore;
  current.innerHTML = currentScore;
  c.font = "30px Arial";
  c.fillStyle = "white";
  c.textAlign = "center";
  c.fillText("Start Game", snakeCanvas.width/2, snakeCanvas.height/2); 
  //start button click event
  snakeCanvas.addEventListener('click', startGame)
}

//main game function, called recursively by setInterval
function game() {

  //clears the canvas every time function is run
  c.fillStyle = "black";
  c.fillRect(0,0, snakeCanvas.width, snakeCanvas.height)

  //adds key press event to listen for arrow keys
  document.addEventListener('keydown', keyPress)
  snakeCanvas.removeEventListener('click', startGame)

  //changes direction of snake according to changes in xv and xy
  playerX += xv;
  playerY += yv;

  //conditionals allow for snake to loop to other side of screen
  if (playerX < 0){
    playerX = tileCount - 1;
  }
  if (playerX > tileCount - 1){
    playerX = 0;
  }
  if (playerY < 0){
    playerY = tileCount - 1;
  }
  if (playerY > tileCount - 1){
    playerY = 0;
  }
  
  //code to draw the snake based on the length of tail
  c.fillStyle = "limegreen";
  for (let i = 0; i < snakePositions.length; i++){

    //code checks each stored position of the snake to check for touches.  If touch occurs, initial states are restored
    c.fillRect(snakePositions[i].x * gridSize, snakePositions[i].y * gridSize, gridSize-2, gridSize-2);
    if (snakePositions[i].x == playerX && snakePositions[i].y === playerY) {
      tail = 5;
      difficulty = 5;
      currentScore = 0;
      current.innerHTML = currentScore;
    }
  }
  //objects are stored according to every current tile the snake occupies
  snakePositions.push({ x: playerX, y: playerY });

  //loop to keep the snake a consistent length
  while (snakePositions.length>tail){
    snakePositions.shift();
  }

  //hit detection for apple
  if (appleX === playerX && appleY === playerY) {
    //if hit on apple occurs, the tail grows, the game speeds up, and the apple position randomizes
    tail++;
    difficulty++
    appleX = ~~(Math.random() * tileCount);
    appleY = ~~(Math.random() * tileCount);
    //check to make sure that apple isn't drawn on top of snake
    for (let i = 0; i < snakePositions.length; i++){
      if ( snakePositions[i].x === appleX && snakePositions[i].y === appleY ) {
        appleX = ~~(Math.random() * tileCount);
        appleY = ~~(Math.random() * tileCount);
      }
    }

    //score increments and is written to screen
    currentScore++
    current.innerHTML = currentScore;

    //highscore is replaced by current score if score is beaten
    if (currentScore > highScore){
      highScore = currentScore;
      high.innerHTML = highScore;
    }
    
  }

  //code for drawing the apple
  c.fillStyle = 'red';
  c.fillRect(appleX * gridSize, appleY * gridSize, gridSize-2, gridSize-2)

  //clearing the interval and resetting it allows for speed changes based on difficulty divisor
  clearInterval(gameInterval);
  gameInterval = setInterval(game, 1000/difficulty);
}


//function checks keycode to detect arrow keys, and adjusts velocity accordingly
function keyPress(event){
  switch (event.keyCode) {
    case 37://left
      xv = -1;
      yv = 0;
      break;
    case 38://up
      xv = 0;
      yv = -1;
      break;
    case 39://right
      xv = 1;
      yv = 0;
      break;
    case 40://down
      xv = 0;
      yv = 1;
      break;
  }
}

//function to start the recursive game loop.
function startGame() {
  c.clearRect(0,0, window.innerWidth, window.innerHeight);
  gameInterval = setInterval(game, 1000/difficulty);
}

initialize();