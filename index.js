
window.onload = () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext("2d");
    let id = null;
    let start = false;

    let hpsong = new Audio();
    hpsong.src = './images/Hedwig s Theme.mp3';

    let winSound = new Audio();
    winSound.src = './images/Wicked.mp3';

    let lostSound = new Audio();
    lostSound.src = './images/Youve lost.mp3'


    class Component {
      constructor(x, y, width, height){
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.speedX = 0;
          this.direction = 'l';
          this.hpImg = new Image();
          this.hpImg.src = './images/hp.png';
          this.hpImgDir = new Image();
          this.hpImgDir.src = './images/hpDir.png';
      }

      createPlayer(){
        if (this.direction === 'l'){
          context.drawImage(this.hpImg, this.x, this.y, this.width,this.height);
        } else {
          context.drawImage(this.hpImgDir, this.x, this.y, this.width,this.height);
        }
      }
    
      newPos(){
      if (this.x >= 0 && this.x <= canvas.width - this.width){
        this.x += this.speedX;
      } else if (this.x < 0){
        this.x += 1;
      } else if (this.x >= canvas.width - this.width) {
        this.x -= 1;
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
        return (
          this.top() === obstacle.bottom() && 
          this.right() > obstacle.left() && 
          this.left() < obstacle.right()
        )
      }  
    }

    class Obstacle {
      constructor(x){
        this.x = x;
        this.y = 0;
        this.width = 30;
        this.height = 30;
      }

      createObstacle(){ 
        this.bludgerImg = new Image();
        this.bludgerImg.src = './images/Bludger.png';
        context.drawImage(this.bludgerImg, this.x, this.y, this.width, this.height);
      }

      createSnitch(){
        this.snitchImg = new Image();
        this.snitchImg.src = './images/black-snitch.png';
        context.drawImage(this.snitchImg, this.x, this.y, this.width + 15, this.height + 15);
      }

      moveObstacle(){
        this.y += 5;
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
    }

    let player = new Component(canvas.width/2, canvas.height - 70, 50, 50);
    let frames = 0;
    let bludgers = [];
    let lifes = 13;
    let snitch = [];


    // Criando novos obstaculos + guardando no array + movendo
    function createObstaclesFunction(){
      frames += 1;
      if (frames % 40 === 0) {
        bludgers.push(new Obstacle(Math.floor(Math.random()*(canvas.width - 25))));
        console.log('bludger criado!');
      }
      if (frames % 150 === 0) {
        console.log('snitch criado')
        setTimeout(function() {
          snitch.push(new Obstacle(Math.floor(Math.random()* (canvas.width - 25))))
        }, 2000)
      }
    }

    function moveObstaclesFunction(){
      bludgers.forEach((elem, index) => {
        elem.createObstacle();
        elem.moveObstacle();
        if (elem.y >= canvas.height){
          bludgers.splice(index, 1);
        }
      })
        snitch.forEach((elem, index) => {
          elem.createSnitch();
          elem.moveObstacle();
          if (elem.y >= canvas.height){
            snitch.splice(index, 1);
        }
      })
    }

    function checkCrash() {
      let crashed = bludgers.some(function(bludger) {
        return player.crashWith(bludger);
      });
    
      if (crashed) {
        console.log('CRASH');
        if (lifes > 0) {
          bludgers.forEach((element, index) => {
            bludgers.splice(index, 1);
            lifes -= 1;
            console.log(lifes);
          })

        // GAME OVER
        } else {
          console.log('GAME OVER');
          hpsong.pause();
          lostSound.play();
          cancelAnimationFrame(id);
          bludgers.forEach((element, index) => {
            bludgers.splice(index, 1);
          })
          context.font = '25px serif';
          context.fillStyle = 'black';
          context.fillText("YOU'VE LOST OLD MAN", 6, canvas.height/2);
        }
      }
    }

    function checkCatch() {
      let catched = snitch.some(function(snitch) {
        return player.crashWith(snitch);
      });
    
      if (catched) {
        console.log('CATCH!');
        if (lifes >= 0) {
          snitch.forEach((element, index) => {
            snitch.splice(index, 1);
            lifes += 2;
            console.log(lifes);
          })
        } 
        if (lifes >= 15) {
          console.log('YOU WON!');
          hpsong.pause();
          winSound.play();
          lifes = 15;
          cancelAnimationFrame(id);
          context.font = '25px serif';
          context.fillStyle = 'black';
          context.fillText('WICKED!', canvas.width/3, canvas.height/2);

        } 
    }
    }

    function lifeScore(points) {
      context.beginPath();
      context.fillStyle = 'rgb(151, 76, 64)';
      context.rect(220, 0, 80, 25);
      context.fill();
      context.font = "18px serif";
      context.fillStyle = "white";
      context.fillText("Score: " + points, 225, 17);
    }

    
    // MOTOR
    function gameUpdate(){
      
      // "CLEAR" (BG)
      context.clearRect(0, 0, 600, 700);
      
      // PRINT O PLAYER
      player.createPlayer();
      player.newPos();

      // PRINT OBSTACULOS (bludger and snitch)
      createObstaclesFunction();
      moveObstaclesFunction();

      // ANIMATION START
      id = requestAnimationFrame(gameUpdate);
      
      // WIN
      checkCatch();
      // CRASH
      checkCrash();
      // PRINT SCORE
      lifeScore(lifes);
    }
     
    
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37: // left arrow
        player.speedX -= 4;
              player.direction = 'l'
          break;
        case 39: // right arrow
        player.speedX += 4;
            player.direction = 'r'
          break;
        case 13: // enter
            if(!start) {
              gameUpdate();
              hpsong.play();
              start = true;
            } else {
              window.location.reload()
            }
        }
    }

    document.onkeyup = function(e) {
      player.speedX = 0;
      player.speedY = 0;
    }
  }