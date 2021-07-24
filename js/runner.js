var gameStarted = false;
var showScore = false;
var highscore = 0;
var distanceTravelled = 0,increasespeed = 0;
var count = 1;
var myRandom = [-2,-1,0,1,2,3]; 
var myPower = [-1,1];
var crash = false;
var endframe = false;
var coin = 0;
var life = 0;
var ballRadius = 20; 
var coinradius = 15;
var floordepth = 140;
var ceildepth = 140; 
var hasplayed = false;
var shape = localStorage.getItem("getshape");
var myImage = localStorage.getItem("getimage");
var defaultShape = "Square";


mySound = document.getElementById("myaudio");
mySound.muted = false;
myfallSound = document.getElementById("mybump");
myfallSound.muted = false;
myfallSound.loop = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

  function playGame(){
      document.getElementById("playButton").style.display="none"; 
      gameStarted = true;
      showScore = true;
      update();
    }

   function floor(x, width,height) {
      this.x = x;
      this.width = width;
      this.height = height;
    }

    function obstacle(x,width,height,rand,powerup) {
      this.x = x;
      this.width = width;
      this.height = height;
      this.radius = ballRadius;
      this.y = ceildepth + this.radius;
      this.rand = rand;
      this.power = powerup;
      this.speedX = 0;
      this.speedY = 0;    
      this.gravity = 0.1;
      this.gravitySpeed = 0;
      this.bounce = 1;
      this.hole = false;
      this.top = false;
      this.ball = false;
      this.powerup = false;
    }
   
    function ceil(x, width,height) {
      this.x = x;
      this.width = width;
      this.height = height;
    }
    function backImage(x,y,width,height) {
      this.image = new Image();
      this.image.src = myImage;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    var world = {
      height: 480,
      width: 640,
      gravity: 10,
      speed: 8,
      initialspeed: 8,
      randomceilWidth: 700,
      randomWidth: 700,
      autoScroll: true,
      floorTiles: [
        new floor(0,600,140)
      ], 
      obstacleBlock:[
        new obstacle(300,60,60,-1,0),
      ],
      ceilTiles: [
        new ceil(0,1000,140)
      ],
       backgroundTiles: [
        new backImage(0,0,640,480)
      ],
      start: function() {
         this.end= setTimeout("update()", 1000/60);
      },
     stop: function() {
       this.autoScroll = false;
       player.scroll = false;
       showScore = false;
       topscorer(distanceTravelled);
       clearInterval(this.end);
       document.getElementById("gameEnd").style.display="block";  
       document.getElementById("retryButton").style.display="block"; 
     },
      
      moveFloor: function() {
         for(index in this.floorTiles) {
          var tile = this.floorTiles[index];
          if (Math.floor(distanceTravelled/5000) > increasespeed){
             ++increasespeed;
             ++this.speed;
           } 
            tile.x += -this.speed;
       }
      },
      
      moveBlock: function() {
        for(index in this.obstacleBlock) {
          var tile = this.obstacleBlock[index];
           if (Math.floor(distanceTravelled/5000) > increasespeed) {
             ++increasespeed;
             ++this.speed;
           } 
           tile.x += -this.speed;
        }   
      },  
        
         
       moveCeil : function() {
         for(index in this.ceilTiles) {
          var tile = this.ceilTiles[index];
           if (Math.floor(distanceTravelled/5000) > increasespeed){
             ++increasespeed;
             ++this.speed;
           } 
           tile.x += -this.speed;
        } 
      },
      
    movebackground : function() {
         for(index in this.backgroundTiles) {
          var tile = this.backgroundTiles[index];
           if (Math.floor(distanceTravelled/5000) > increasespeed){
             ++increasespeed;
             ++this.speed;
           } 
           tile.x += -this.speed;
          }  
      },
      
      addFutureTiles: function() {
        var previousTile = this.floorTiles[this.floorTiles.length - 1];
        var previousceilTile = this.ceilTiles[this.ceilTiles.length - 1];            
        var previousBlock = this.obstacleBlock[this.obstacleBlock.length - 1];
        var previousBackground = this.backgroundTiles[this.backgroundTiles.length - 1];
        
        var randomBlockHeight = (Math.floor(Math.random() * (100)))+50; 
        var randomBlockWidth = Math.floor(Math.random() * (100))+ 50;
        var randomBlockGap = Math.floor(Math.random() * (200))+ 300 ; 
        var randomObstacles = myRandom[Math. floor(Math. random()*myRandom. length)] ;
        var randompowerups = myPower[Math. floor(Math. random()*myPower. length)] ;
        
        var next = new floor(previousTile.x + previousTile.width,this.randomWidth,floordepth);
        this.floorTiles.push(next);
        var ceilnext = new ceil(previousceilTile.x + previousceilTile.width, this.randomceilWidth,ceildepth);
        this.ceilTiles.push(ceilnext); 
        var blocknext = new obstacle(previousBlock.x + randomBlockGap ,randomBlockWidth,randomBlockHeight,randomObstacles,randompowerups);
        this.obstacleBlock.push(blocknext);
        var backnext = new backImage(previousBackground.x + previousBackground.width ,0,this.width,this.height);
        this.backgroundTiles.push(backnext);
      },
      
      cleanOldTiles: function() {
        for(index in this.floorTiles) {
          if(this.floorTiles[index].x <= -this.floorTiles[index].width) {
            this.floorTiles.splice(index, 1);
          }
        }
        for(index in this.obstacleBlock) {
          if(this.obstacleBlock[index].x <= -this.obstacleBlock[index].width) {
            this.obstacleBlock.splice(index, 1);
          }
        }
        for(index in this.ceilTiles) {
          if(this.ceilTiles[index].x <= -this.ceilTiles[index].width) {
            this.ceilTiles.splice(index, 1);
          }
        }
       for(index in this.backgroundTiles) {
          if(this.backgroundTiles[index].x <= -this.backgroundTiles[index].width) {
            this.backgroundTiles.splice(index, 1);
          }
        } 
      },
        
      getDistanceToFloor: function(playerX) {
        for(index in this.floorTiles) {
          var tile = this.floorTiles[index];
          if(tile.x <= playerX && tile.x + tile.width >= playerX) {
            return tile.height;
          }
        }
        return -1;
      },
      
      getDistanceToCeil: function(playerX) {
        for(index in this.ceilTiles) {
          var tile = this.ceilTiles[index];
          if(tile.x <= playerX && tile.x + tile.width >= playerX) {
            return tile.height;
          }
        }
        return -1;
      },
      
      getObstacleX: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].x; 
           return x;
        }
       },
         
       getObstacleH: function() {
         for(index in this.obstacleBlock) {
          var h = this.obstacleBlock[index].height; 
            return h;
          }
       },
       getObstacleW: function() {
         for(index in this.obstacleBlock) {
          var w = this.obstacleBlock[index].width; 
            return w;
         }
       },
      getObstacleY: function() {
         for(index in this.obstacleBlock) {
          var y = this.obstacleBlock[index].y ; 
            return y;
         }
       },
      getObstaclehole: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].hole; 
           return x;
        }
       },
      getObstacleradius: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].radius; 
           return x;
        }
       },
       getObstacletop: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].top; 
           return x;
        }
       },
      
       getObstacleball: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].ball; 
           return x;
        }
       },
       getObstaclepower: function() {
         for(index in this.obstacleBlock) {
          var x = this.obstacleBlock[index].powerup; 
           return x;
        }
       },
      
      getObstacledistance: function() {
         for(index in this.obstacleBlock) {
         this.obstacleBlock[index].x = player.x -this.obstacleBlock[index].width ;
           return;
         }
       },
      update: function() {
        if(!this.autoScroll) {
          return;
        }
        this.cleanOldTiles();
        this.addFutureTiles();
        this.movebackground();
        this.moveFloor();
        this.moveCeil();
        this.moveBlock();
      },
       
      draw: function() {
           
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
       for(index in this.backgroundTiles) {
          var tile = this.backgroundTiles[index];
          ctx.drawImage(tile.image,tile.x,tile.y,tile.width, tile.height);      
           }
        
        for(index in this.floorTiles) {
           var tile = this.floorTiles[index];
           var y = world.height - tile.height;
           ctx.fillStyle = "khaki";
           ctx.fillRect(tile.x, y, tile.width, tile.height);
         }
        
         for(index in this.ceilTiles) {
          var tile = this.ceilTiles[index];
          var y = 0;
          ctx.fillStyle = "khaki";
          ctx.fillRect(tile.x, y, tile.width, tile.height);
        }
        
        for(index in this.obstacleBlock) {
         var tile = this.obstacleBlock[index];
         
         if(tile.rand == -1) {
           tile.y = world.height - floordepth;
           ctx.fillStyle = "black";
           ctx.fillRect(tile.x, tile.y, tile.width, floordepth);
           tile.hole = true; 
           tile.top = false;
          }
                   
           if (tile.rand == -2) {
            tile.y = ceildepth; 
            ctx.fillStyle = "black";
            ctx.fillRect(tile.x, tile.y, tile.width, -ceildepth);
             tile.hole = true; 
            tile.top = true;
           }
            
          if (tile.rand == 2) {
           tile.y = ceildepth;
           ctx.fillStyle = "khaki";
           ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
           tile.hole = false; 
           tile.top = true;
           } 
          
          if (tile.rand == 0) {
           tile.width = 2*tile.radius;
           tile.height = 2*tile.radius;
           ctx.beginPath();
           ctx.arc(tile.x,tile.y, tile.radius, 0, Math.PI*2);
           ctx.fillStyle = "red";
           ctx.fill();
           ctx.closePath();   
           tile.gravitySpeed += tile.gravity;
           tile.x += tile.speedX;
           tile.y += tile.speedY + tile.gravitySpeed;
           var rockbottom = world.height - floordepth;
           if (tile.y+tile.radius > rockbottom) {
             tile.y = rockbottom-tile.radius;
             tile.gravitySpeed = -(tile.gravitySpeed * tile.bounce);
          }
           tile.ball = true; 
          } 
                 
         if(tile.rand == 1) {
          tile.y = world.height - floordepth;
          ctx.fillStyle = "khaki";
          ctx.fillRect(tile.x, tile.y, tile.width, -tile.height);
          tile.hole = false;
          tile.top = false;
          }   
          
         if(tile.rand == 3) {
           tile.powerup = true;
           tile.radius = coinradius;
           tile.width = 2*tile.radius;
           tile.height = 2*tile.radius;
           if (tile.power == -1) {
             tile.top = true; 
             tile.y = ceildepth + tile.radius;
           }
           else {
             tile.top = false;
             tile.y = world.height - floordepth - tile.radius;
           }
           ctx.beginPath();
           ctx.arc(tile.x, tile.y, tile.radius, 0, Math.PI*2);
           ctx.fillStyle = "gold";
           ctx.fill();
           ctx.closePath(); 
         }  
       }
      },
    };

   var player = {
      x: 50,
      y: world.height-floordepth,
      height: 30,
      width: 30,
      scroll: true,
      playerlife: 0,
      speed: 10,
      getDistanceFor: function(x) {
      if(this.y>=world.height-floordepth) {
        var platform = world.getDistanceToFloor(x);
        return world.height - this.y - platform; 
           }
       if(this.y<=ceildepth) {
         var platform = world.getDistanceToCeil(x);
         return this.y- platform;
       }  
      },
  
      applyGravity: function() {
        this.currentDistanceAboveplatform = this.getDistanceFor(this.x);
        var rightHandSideDistance = this.getDistanceFor(this.x + this.width);
        if (showScore) {
        distanceTravelled += player.speed;
        }
        if (player.crashWithpowerup(world.obstacleBlock[this])) { 
               world.getObstacledistance();
               coin ++; 
        }
       if(this.currentDistanceAboveplatform > 0 ||  rightHandSideDistance < 0 || (player.crashWithfloor(world.obstacleBlock[this])) 
          || (player.crashWithceil(world.obstacleBlock[this])) || (player.crashWithball(world.obstacleBlock[this])))  {   
         if (life<=0)   { 
             playfallsound();       
             world.stop(); 
          }
          else {
            endframe = false;
            world.getObstacledistance();
            if(player.y !=140 || player.y != 340){
              if(player.height < 0) { player.y = 140; }
              else { player.y = 340;}
            }  
            life--;
            crash = false;
         } 
        }  
       },  
     
     
    processGravity: function() {
      if (this.y>=world.height-floordepth) {
        this.y += world.gravity;
        var floorHeight = world.getDistanceToFloor(this.x, this.width);
        var topYofPlatform = world.height - floorHeight;
        if ((this.y > topYofPlatform) && (!endframe)) {
          this.y = topYofPlatform;
        }
      }
      if(this.y<=ceildepth) {
        this.y -= world.gravity;
        var floorHeight = world.getDistanceToCeil(this.x, this.width);
        var topYofPlatform = floorHeight;
        if ((this.y < topYofPlatform) && (!endframe)) {
           this.y = (topYofPlatform);
        }
       } 
    },
      
   crashWithfloor : function(otherobj) { 
    var Ball = world.getObstacleball(); 
    var Powerup = world.getObstaclepower();  
    if (!Ball && !Powerup) {  
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mybottom = this.y;
    var mytop = this.y - (this.height);
    var Hole = world.getObstaclehole();
    var Top = world.getObstacletop();  
    var otherleft = world.getObstacleX();
    var otherright = world.getObstacleX() + world.getObstacleW();
    var othertop =  (-world.getObstacleH() + world.height - floordepth) ;
    var otherbottom = world.height - floordepth ; 
        
   if ((myright >= otherleft) && (mybottom == otherbottom) && (myright <= otherright) && !Top) {
     if (Hole ) {
         player.y = world.height;
         player.height = Math.abs(player.height);  
         endframe = true;
     }
      crash = true;
    }
    if ((myleft >= otherleft) && (myleft <= otherright) && (mybottom >= othertop) && !Top) {
      if (!Hole) {
         player.x = player.x;
         player.y = world.height-floordepth -world.getObstacleH();
         player.height = Math.abs(player.height); 
         endframe = true;
       }    
       crash = true;
      }  
    } 
    return crash;
  },
      
   crashWithceil : function(otherobj) {
   var Ball = world.getObstacleball(); 
   var Powerup = world.getObstaclepower();  
   if (!Ball && !Powerup) {    
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mybottom = this.y;
    var mytop = this.y - (this.height);
    var Hole = world.getObstaclehole();
    var Top = world.getObstacletop();
    var otherleft = world.getObstacleX();
    var otherright = world.getObstacleX() + world.getObstacleW();
    var othertop =  ceildepth + world.getObstacleH() ;
    var otherbottom = ceildepth; 
    
    if ((myright >= otherleft) && (mybottom == otherbottom) && (myright <= otherright) && Top) {
     if (Hole) {
          player.y = 0;
          player.height = -(Math.abs(player.height));  
          endframe = true;
      }
       crash = true;
     }
    if ((myleft >= otherleft) && (myleft <= otherright) && (mybottom <= othertop) && Top ) {
      if (!Hole) {
         player.x = player.x;
         player.y = ceildepth + world.getObstacleH();
         player.height = -(Math.abs(player.height)); 
         endframe = true;
       }    
       crash = true;
    }  
   } 
     return crash;
   },
   
       
   crashWithball : function(otherobj) {
    var Ball = world.getObstacleball(); 
    if ( Ball ) {
     crash = this.collisiondetection(otherobj);
    }
     return crash; 
   },
     
   crashWithpowerup : function(otherobj) {
    var Powerup = world.getObstaclepower();  
    if (Powerup ) {
     var collide = this.collisiondetection(otherobj);
     return collide;
    } 
    }, 
    
   collisiondetection: function(otherobj) {
    var lx = this.x;
    var ly = this.y;   
    var rx = this.x + (this.width);
    var ry = this.y;
    var tx = (this.x + this.width)/2;
    var ty = this.y - (this.height);
    var cx = world.getObstacleX() ;
    var cy = world.getObstacleY() ;
    var cirrad = world.getObstacleradius() ;  
     if (shape == "Square") {
     for(var y=ry; y>=ty ; y--) {
         var d = cirrad**2 - ((rx-cx)**2 + (y-cy)**2 );  
         if (d>=0) {
              return true;
          } 
         }
  
      for(var y=ry; y<=ty ; y++) {
         var d = cirrad**2 - ((rx-cx)**2 + (y-cy)**2 );  
         if (d>=0) { 
              return true;
          } 
         }
      for(var y=ly; y<=ty ; y++) {
         var d = cirrad**2 - ((lx-cx)**2 + (y-cy)**2 );  
         if (d>=0){ 
              return true;
          } 
         }
  
      for(var y=ly; y>=ty ; y--) {
         var d = cirrad**2 - ((lx-cx)**2 + (y-cy)**2 );  
         if (d>=0){
             return true;
          } 
         }
      for(var x=lx; x<=rx ; x++) {
         var d = cirrad**2 - ((x-cx)**2 + (ly-cy)**2 );  
         if (d>=0){
              return true;
          } 
       }
      for(var x=rx; x>=lx ; x--) {
        var d = cirrad**2 - ((x-cx)**2 + (ry-cy)**2 );  
        if (d>=0){
             return true;
        } 
      }
    for(var x=lx; x<=rx ; x++) {
         var d = cirrad**2 - ((x-cx)**2 + (ty-cy)**2 );  
         if (d>=0){
              return true;
          } 
       }
      for(var x=rx; x>=lx ; x--) {
        var d = cirrad**2 - ((x-cx)**2 + (ty-cy)**2 );  
        if (d>=0){
            return true;
        } 
      }
   } 
  if (shape == "Triangle") {
      for(var x=tx; x<=rx; x++) {
        for(var y=ty; y<=ry ; y++) {
         var d = cirrad**2 - ((x-cx)**2 + (y-cy)**2 );  
         if (d>=0) { return true;} 
         }
      } 
     for(var x=tx; x<=rx; x++) {
        for(var y=ty; y>=ry ; y--) {
         var d = cirrad**2 - ((x-cx)**2 + (y-cy)**2 );  
         if (d>=0){
             return true;
          } 
         }
     }
      for(var x=lx; x<=tx; x++) {
        for(var y=ly; y>=ty ; y--) {
         var d = cirrad**2 - ((x-cx)**2 + (y-cy)**2 );  
         if (d>=0){
            return true;
          } 
         }
     }
     for(var x=lx; x<=tx; x++) {
        for(var y=ly; y<=ty ; y++) {
         var d = cirrad**2 - ((x-cx)**2 + (y-cy)**2 );  
         if (d>=0){
             return true;
          } 
         }
      } 
      for(var x=lx; x<=rx ; x++) {
         var d = cirrad**2 - ((x-cx)**2 + (ly-cy)**2 );  
         if (d>=0){
             return true;
          } 
       }
    } 
   return false;  
   }, 
     
   update: function() {
    this.processGravity();
    this.applyGravity();
   },
      
    jump: function() {
     if ((gameStarted) && (player.scroll))  {
     if (count % 2 == 0  ) {
       player.x = player.x;
       player.y = world.height-floordepth;
       player.height= 30;
       count=count+1;
      }
    else  {
        player.x = player.x;
        player.y =ceildepth;
        player.height= -30;
        count=count+1;
      }
    }
   },

    score: function() {
      ctx.fillStyle = "red";
      ctx.font = "bolder 18px Lucida Handwriting";
      ctx.fillText("Your score : " + (distanceTravelled ), 10, 75);
      ctx.fillText("Top score  : " + localStorage.getItem("bestscore"), 10, 45);
      if(gameStarted){
           ctx.fillText("Speed  : " + (world.speed-world.initialspeed+1), 10, 105);
           ctx.fillText("(20 coins = 1 life)" , 400, 45);
           ctx.fillText("Coins  : " + coin , 400, 75);
           ctx.fillText("Life  : " + life, 400, 105);
           if( coin >= 20){
             life++;
             coin = coin-20;
           }
        }  
      },
      
     draw: function() {
      if (shape=="Square"){
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, this.width, -this.height);
        }
        if (shape=="Triangle"){
         ctx.fillStyle = "blue";
          var path=new Path2D();
            path.moveTo((this.x+this.width),(this.y));
            path.lineTo((this.x),(this.y-this.height));
            path.lineTo((this.x)-this.width,this.y);
            ctx.fill(path);
        }
      },
   
};

document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
         player.jump();
    }
  });

function topscorer(currentscore) {   
  if(localStorage.getItem("bestscore")==null) {   
    localStorage.setItem("bestscore",0);
   }
   highscore = localStorage.getItem("bestscore");
  if (currentscore >highscore) {    localStorage.setItem("bestscore",currentscore);
        
  }
  }

function playsound() {
  mySound.play();
}


function playfallsound() {
 if(!hasplayed) {
   mySound.muted = true;
   myfallSound.play();
   hasplayed =true;
}
}

function stopfallsound() {
  myfallSound.muted = true;
}

 function update() {
   if(localStorage.getItem("bestscore")==null) {   
           localStorage.setItem("bestscore",0);
    }
  
    world.draw();
    player.draw();
    player.score();
    if (gameStarted) { 
     playsound();   
     player.update();
     world.update();
     world.start();
    } 
 }
update();


 








 





