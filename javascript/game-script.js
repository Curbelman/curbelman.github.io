function startGame(){
  myGameArea.start();
}

function updateGameArea() {
  myGameArea.clear();
  background.update();
  player.newPos();
  player.update();
  updateCats();
  updateEnemy();
  updateShrooms();
  checkPetCat();
  checkEnemyCrash();
  checkEatShroom();
  checkGameOver();
  myGameArea.score();
  myGameArea.lives();
}

function difficultySetting(){
  if (points >= 10 || myGameArea.frames > 90000){
    return 30;
  }
  else if (points >= 5 || myGameArea.frames > 45000){
    return 60;
  }
  else {
    return 90;
  }
}


function updateEnemy() {
    for (i = 0; i < myEnemy.length; i++) {
      if (myEnemy[i].x < 0){
        myEnemy.splice(i,1);
      }
      else if(myEnemy[i].x<=player.x+player.width+90 && myEnemy[i].x>player.x && myEnemy[i].y<=player.y+player.height+90 && myEnemy[i].y>player.y){
        myEnemy[i].x += -5;
        myEnemy[i].y += -2;
      } 
      else if (myEnemy[i].x<=player.x+player.width+90 && myEnemy[i].x>player.x && myEnemy[i].y+myEnemy[i].height>=player.y-90 && myEnemy[i].y+myEnemy[i].height<player.y){
        myEnemy[i].x += -5;
        myEnemy[i].y += +2;
      }
      else {
        myEnemy[i].x += -2;
        if (myEnemy[i].y + myEnemy[i].height + (Math.floor(Math.random() * 6) * (Math.round(Math.random()) ? 1 : -1)) > 500){
          myEnemy[i].y += (500 - (myEnemy[i].y + myEnemy[i].height));
        }
        else if (myEnemy[i].y + (Math.floor(Math.random() * 6) * (Math.round(Math.random()) ? 1 : -1)) < 0){
          myEnemy[i].y -= myEnemy[i].y
        }
        else{
          myEnemy[i].y += Math.floor(Math.random() * 6) * (Math.round(Math.random()) ? 1 : -1)
        }
      }
      myEnemy[i].update();
    }

  myGameArea.frames += 1;
  if (myGameArea.frames % (difficultySetting()) === 0) {
    let x = myGameArea.canvas.width;
    let y = Math.floor(Math.random() * (myGameArea.canvas.height-20));
    myEnemy.push(new Component(20, 20, 'green', x, y, "/images/transparent wasp.png"));
  }
}

function updateCats(){
  for (i=0;i<myCats.length;i++){
    if (myCats[i].x < 0){
      myCats.splice(i,1);
    }
    else{
      myCats[i].x += -1;
    }
    myCats[i].update();
  }

  if (myGameArea.frames % 270 === 0 && myGameArea.frames > 1) {
   let x = myGameArea.canvas.width;
   let y = Math.floor(Math.random() * (myGameArea.canvas.height-40));
   myCats.push (new Component(40, 40, 'blue', x, y, "/images/Cat.png"));
    }
}



function updateShrooms(){
  for (i=0;i<shrooms.length;i++){
    if (shrooms[i].time > 600){
      shrooms.splice(i,1);
    }
    else{
      shrooms[i].time += 1;
    }
    shrooms[i].update();
  }

  if (myGameArea.frames % 1200 === 0 && myGameArea.frames > 1) {
   let x = Math.floor(Math.random() * (myGameArea.canvas.width-30));
   let y = Math.floor(Math.random() * (myGameArea.canvas.height-30));
   shrooms.push (new Component(30, 30, 'blue', x, y, "/images/Mushroom.png"));
    }
}

function checkEatShroom(){
  for (i=0; i<shrooms.length;i++){
    if(player.crashWith(shrooms[i])){
      if (playerLives<3){
        playerLives += 1
      }
      shrooms.splice(i,1)
    }
  }
}

function checkPetCat (){
  for (i=0; i<myCats.length; i++){
    if (player.crashWith(myCats[i])){
      points += 1
      myCats.splice(i,1)
    }
  }
}

function checkEnemyCrash(){
  for (i=0; i<myEnemy.length; i++){
    if (player.crashWith(myEnemy[i])){
      playerLives -= 1;
      myEnemy.splice(i,1)
    }
  }
}

function checkGameOver() {
  if (playerLives <= 0){
    myGameArea.stop();
  }
}

const myEnemy = [];

const myCats = [];

const shrooms = [];

let playerLives = 3;

let points = 0;

const myGameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 500;
    this.canvas.style = 'border: 1px solid black;';
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },

  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function () {
    clearInterval(this.interval);
  },

  score: function () {
    this.context.font = '32px Copperplate, Papyrus, fantasy';
    this.context.fillStyle = 'black';
    this.context.fillText(`Score: ${points}`, 25, 25);
  },

  lives: function(){
    this.context.font = '32px Copperplate, Papyrus, fantasy';
    this.context.fillStyle = 'black';
    this.context.fillText(`Lives: ${playerLives}`, 750, 25);
  },
};

class Component {
  constructor(width, height, color, x, y, imageSource) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.time = 0;
    this.img = new Image ();
    this.img.src = imageSource;
  }
 
  update() {
    const ctx = myGameArea.context;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.newPosX();
    this.newPosY();
  }

  newPosX(){
    if(this.x + this.width + this.speedX > 900){
      this.x += (900-(this.x + this.width));
    }
    else if (this.x + this.speedX < 0){
      this.x -= this.x;
    }
    else {
      this.x += this.speedX;
    }
  }

  newPosY(){
    if(this.y + this.height + this.speedY > 500){
      this.y += (500-(this.y + this.height));
    }
    else if (this.y + this.speedY < 0){
      this.y -= this.y;
    }
    else {
      this.y += this.speedY;
    }
}

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
 
  crashWith(obstacle) {
    return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
  }

  attractFieldLeft() {
    return this.x - 5;
  }
  attractFieldRight() {
    return this.x + this.width + 5;
  }
  attractFieldTop() {
    return this.y - 5;
  }
  attractFieldBottom() {
    return this.y + this.height + 5;
  }
}

const player = new Component(60, 60, 'red', 420, 220, "/images/SantaManTransparent.png");

const background = new Component(900, 500, 'red', 0,0, "/images/grass background.png");



document.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 38: // up arrow
    if (player.speedY >= -5){
      player.speedY -= 5;
    }
    else {
      player.speedY = -10;
    }
      break;
    case 40: // down arrow
    if (player.speedY <= 5){
      player.speedY += 5;
    }
    else {
      player.speedY = 10;
    }
      break;
    case 37: // left arrow
    if (player.speedX >= -5){
      player.speedX -= 5;
    }
    else {
      player.speedX = -10;
    }
      break;
    case 39: // right arrow
    if (player.speedX <= 5){
      player.speedX += 5;
    }
    else {
      player.speedX = 10;
    }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  player.speedX = 0;
  player.speedY = 0;
});


startGame();