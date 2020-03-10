
window.onload = () => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext("2d");
    let id = null;
    
    let start = false;


    class Component {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
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
          this.top() === obstacle.bottom() && this.right() > obstacle.left() && this.left() < obstacle.right()
          // this.right() === obstacle.left() ||
          // this.left() === obstacle.right()
        )
      }
      
    }

    class Obstacle {
      constructor(x){
        this.x = x;
        this.y = 0;
        this.width = 25;
        this.height = 25;
      }

      createObstacle(){ 
        // context.beginPath();
        // context.lineWidth = "6";
        // context.fillStyle = "blue";
        // context.rect(this.x, this.y, this.width, this.height);
        // context.fill();
        // }
        this.bludgerImg = new Image();
        this.bludgerImg.src = './images/Bludger.png';
        context.drawImage(this.bludgerImg, this.x, this.y, this.width, this.height);
      }

      // createSnitch(){
      //   this.snitchImg = new Image();
      //   this.snitchImg.src = './images/snitch.png';
      //   context.drawImage(this.snitchImg, this.x, this.y, this.width,this.height);
      // }

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

    let player = new Component(canvas.width/2, canvas.height - 25, 25, 25);
    let frames = 0;
    let bludgers = [];
    let lifes = 10;
    // let snitch = [];


    // criando novos obstaculos + guardando no array + movendo
    function createObstaclesFunction(){
      frames += 1;
      if (frames % 100 === 0) {
        console.log('criado!')
        bludgers.push(new Obstacle(Math.floor(Math.random()*canvas.width)));
        console.log(bludgers);
      };
    }

    function moveObstaclesFunction(){
      bludgers.forEach((elem, index) => {
        elem.createObstacle();
        elem.moveObstacle();
        // tira bludger da array quando sai do canvas
        if (elem.y >= canvas.height){
          bludgers.splice(index, 1);
        }
      })
    }

    // GOLDEN SNITCH
    // function createSnitch() {
    //   frames += 1;
    //   if (frames % 100 === 0) {
    //     snitch.push(new Obstacle(Math.floor(Math.random()* canvas.width)));
    //   }
    // }
    // function moveSnitchFunction(){
    //   bludgers.forEach(elem => {
    //     elem.createSnitch();
    //     elem.moveObstacle();
    //   })
    // }


    function lifeScore(points) {
      context.font = "18px serif";
      context.fillStyle = "black";
      context.fillText("Score: " + points, 350, 50);
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
        } else {
          console.log('GAME OVER');
          cancelAnimationFrame(id);
          bludgers.forEach((element, index) => {
            bludgers.splice(index, 1);
          })
        }
      }
    }
    
    // MOTOR
    function gameUpdate(){
      
      // "CLEAR" (BG)
      context.clearRect(0, 0, 600, 700);
      
      // PRINT O PLAYER
      player.newPos();
      
      context.beginPath();
      context.lineWidth = "3";
      context.lineStyle = 'black'
      context.fillStyle = "rgb(181,78,86)";
      context.rect(player.x, player.y, player.width, player.height);
      context.fill();
      context.stroke();



      // PRINT OBSTACULOS
      createObstaclesFunction();
      moveObstaclesFunction();

      // PRINT SNITCH
      // createSnitch();
      // moveSnitchFunction();

      // PRINT SCORE
      lifeScore(lifes);
        
      // ANIMATION START
      id = requestAnimationFrame(gameUpdate);

      // CRASH
      checkCrash();
    }
     
    
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37: // left arrow
              player.speedX -= 2;
          break;
        case 39: // right arrow
            player.speedX += 2;
          break;
        case 13: // enter
            if(!start) {
              gameUpdate();
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