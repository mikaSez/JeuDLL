var allLevels = [
{'id':1, 'position': {'x':14, 'y':10}, 'exit' : {'x':100, 'y': 150}
},
{'id':2, 'position': {'x':14, 'y':15}, 'exit' : {'x':200, 'y': 150}},
{'id':3, 'position': {'x':14, 'y':15}, 'exit' : {'x':200, 'y': 150}, 'obstacles': [
{'id':1, 'x':110, 'y':100, 'height': 100, 'width':30  },
{'id':2, 'x':110, 'y':100, 'height': 30, 'width':100  },
] },
{'id':4, 'position': {'x':14, 'y':15}, 'exit' : {'x':200, 'y': 150}, 'obstacles': [
{'id':1, 'x':110, 'y':100, 'height': 100, 'width':30, 'speedX' : 10, 'speedY': -10},
{'id':2, 'x':110, 'y':100, 'height': 30, 'width':100, 'speedX' : 20, 'speedY': 120},
] },
];


// Inits
window.onload = function init() {
    var game = new GF();
    game.start();
};

// GAME FRAMEWORK STARTS HERE
var GF = function () {
    // Vars relative to the canvas
    var canvas, ctx, w, h;
    var mario;
	var peach;
    var levels;
    var level;
    var exit;
    var gravity = 10;
    var fps = window.fps;

    var obstacles = [];

    // vars for handling inputs
    var inputStates = {};

    // game states
    var gameStates = {
        mainMenu: 0,
        gameRunning: 1,
        gameOver: 2
    };
    var currentGameState = gameStates.gameRunning;
    var currentLevel = 1;
    var TIME_BETWEEN_LEVELS = 0;
    var currentLevelTime = TIME_BETWEEN_LEVELS;
    var plopSound;




    // clears the canvas content
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }
    
    var mainLoop = function (time) {
        //main function, called each frame 
        fps.measure(time);

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        if (mario.option.dead) {
            currentGameState = gameStates.gameOver;
        }

        switch (currentGameState) {
            case gameStates.gameRunning:
				
				        peach.draw();
                for(obstacle of obstacles){

                    obstacle.move(delta);
                    obstacle.draw();
                }
                // Check inputs and move mario
                mario.draw();    
                mario.updatePosition(delta);					

				// Check collision between mario and walls
				checkCollisionWall(mario, canvas);
				
				// test if mario saves the princess
				if(rectsOverlap(mario.option.x, mario.option.y, mario.option.width, mario.option.height, peach.option.x, peach.option.y, peach.option.width, peach.option.height))
				{
					plopSound.play();
					currentGameState = gameStates.levelWin;
				}

				// check collision
				       
              mario.option.dead = checkCollisionObstacles(mario, obstacles);
               
				
                // display Score
                displayScore();

                // increase currentLevelTime. 
                currentLevelTime += delta;

                if (inputStates.escape) {
                    currentGameState = gameStates.mainMenu;
                }

                break;
                case gameStates.mainMenu:
                ctx.fillStyle = 'black';
                ctx.fillText("MAIN MENU", 20, 100);
                ctx.fillText("Press SPACE to restart", 20, 150);
                ctx.fillText("Press ENTER to back to game", 20, 200);
                ctx.fillText("Move with arrow keys", 40, 250);
                ctx.fillText("Save Princess Peach as fast as you can", 20, 300);
                if (inputStates.space) {
                    startNewGame();
                } else if(inputStates.enter) {
                   currentGameState = gameStates.gameRunning;
               }

               break;
               case gameStates.gameOver:
               ctx.fillStyle = 'red';
               ctx.fillText("GAME OVER :(", 20, 100);
			         ctx.fillStyle = 'black';
                ctx.fillText("Press SPACE to start again", 20, 150);
                ctx.fillText("Move with arrow keys", 20, 200);
                ctx.fillText("Save Princess Peach", 20, 250);
                if (inputStates.space) {
                    startNewGame();
                }
                break;
                case gameStates.levelWin:
                
                ctx.fillStyle = 'green';
                ctx.fillText("CONGRATULATIONS :)", 20, 100);
                ctx.fillStyle = 'black';
                if(levels.length === currentLevel){  
                   ctx.fillText("You saved the princess !!", 20, 150);
                   ctx.fillText("Press SPACE to play again", 20, 200);
                   if (inputStates.space) {
                    startNewGame();
                }
            } else {
                ctx.fillText("Press SPACE to go to the next level", 20, 150);
                ctx.fillText("Move with arrow keys", 20, 200);
                ctx.fillText("Save Princess Peach as fast as you can", 20, 250);
                if (inputStates.space) {
                    goToNextLevel();
                    currentGameState = gameStates.gameRunning;
                }
            }

            break;
        }

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    function startNewGame() {
        mario.option.dead = false;
        currentLevelTime = 0;
        currentLevel = 1;  
        loadLevel();
        currentGameState = gameStates.gameRunning;
    }
    function loadLevel(){
        var level = levels[currentLevel-1];
        mario.setPosition(level.position.x, level.position.y);
		    peach.setPosition(level.exit.x, level.exit.y);
        obstacles = [];
        if(level.obstacles !== undefined) {
            for(obstacle of level.obstacles){
                var o = new Obstacle(obstacle.x, obstacle.y, obstacle.height, obstacle.width, canvas, ctx);
                o.speed(obstacle.speedX, obstacle.speedY);
                obstacles.push(o);
            }
        }
        
    }

    function goToNextLevel() {
        // reset time available for next level
        // 5 seconds in this example
        currentLevelTime = 0;
        currentLevel++;
        loadLevel();
        
    }

    function displayScore() {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillText("Level: " + currentLevel, 300, 30);
        ctx.fillText("Time: " + (currentLevelTime / 1000).toFixed(1), 300, 60);
        ctx.restore();
    }

    /*---------------------------------------*/
    /* SPRITE UTILITY FUNCTIONS              */
    /*---------------------------------------*/
   function SpriteImage(img, x, y, width, height) {
	   this.img = img;  // the whole image that contains all sprites
	   this.x = x;      // x, y position of the sprite image in the whole image
	   this.y = y;
	   this.width = width;   // width and height of the sprite image
	   this.height = height;
	   // xPos and yPos = position where the sprite should be drawn,
	   // scale = rescaling factor between 0 and 1
	   this.draw = function(ctx, xPos, yPos, scale) {
		  ctx.drawImage(this.img,
						this.x, this.y, // x, y, width and height of img to extract
						this.width, this.height,
						xPos, yPos,     // x, y, width and height of img to draw
						this.width*scale, this.height*scale);
		  };
	}

	function Sprite() {
	  this.spriteArray = [];
	  this.currentFrame = 0;
	  this.delayBetweenFrames = 10;
	  
	  this.extractSprites = function(spritesheet, nbPostures, postureToExtract, nbFramesPerPosture, 
	   spriteWidth, spriteHeight) {
		  // number of sprites per row in the spritesheet
		  var nbSpritesPerRow = Math.floor(spritesheet.width / spriteWidth);

		  // Extract each sprite
		  var startIndex = (postureToExtract-1) * nbFramesPerPosture;
		  var endIndex = startIndex + nbFramesPerPosture;
		  for(var index = startIndex; index < endIndex; index++) {
			  // Computation of the x and y position that corresponds to the sprite
			  // index
			  // x is the rest of index/nbSpritesPerRow * width of a sprite
			  var x = (index % nbSpritesPerRow) * spriteWidth;
			  // y is the divisor of index by nbSpritesPerRow * height of a sprite
			  var y = Math.floor(index / nbSpritesPerRow) * spriteHeight;

			  // build a spriteImage object
			  var s = new SpriteImage(spritesheet, x, y, spriteWidth, spriteHeight);

			  this.spriteArray.push(s);
		  }
	  };
	  
	  this.then = performance.now();
	  this.totalTimeSinceLastRedraw = 0;
	  
	  this.drawStopped = function(ctx, x, y) {
		var currentSpriteImage = this.spriteArray[this.currentFrame];
		currentSpriteImage.draw(ctx, x, y, 1);
		
	};

	this.draw = function(ctx, x, y) {
		// Use time based animation to draw only a few images per second
		var now = performance.now();
		var delta = now - this.then;
		
		// draw currentSpriteImage
		var currentSpriteImage = this.spriteArray[this.currentFrame];
		// x, y, scale. 1 = size unchanged
		currentSpriteImage.draw(ctx, x, y, 1);
		
		// if the delay between images is elapsed, go to the next one
		if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
		   // Go to the next sprite image
		   this.currentFrame++; 
		   this.currentFrame %=  this.spriteArray.length;

		  // reset the total time since last image has been drawn
		  this.totalTimeSinceLastRedraw = 0;
	  } else {
		  // sum the total time since last redraw
		  this. totalTimeSinceLastRedraw += delta;
	  }

	  this.then = now;
	};

	this.setNbImagesPerSecond = function(nb) {
		// elay in ms between images
		this.delayBetweenFrames = 1000 / nb;
	};
	}
	/*---------------------------------------*/
	/* END OF SPRITE UTILITY FUNCTIONS        */
	/*---------------------------------------*/


var loadAssets = function(callback) {
      levels = allLevels;
      
      loadSounds().then(function(response){
        console.info("all sounds are loaded");
      }).then(function(){
        loadSprites().then(function(response){
            console.info("all sprites are loaded");
            callback();
        });
      });
    };



    var loadSounds = function(){ 
        return new Promise(function(resolve, reject) {
            // simple example that loads a sound and then calls the callback. We used the howler.js WebAudio lib here.
            // Load sounds asynchronously using howler.js
            plopSound = new Howl({
                urls: ['http://mainline.i3s.unice.fr/mooc/plop.mp3'],
                autoplay: false,
                volume: 1,
                onload: function () {
                        resolve("");
                      
                }
            });

        });

    };

    
    
    var loadSprites = function(){
      return new Promise(function(resolve, reject) {
          loadMario().then(function(response){
              console.info("mario loaded");
          }).then(function(){
              loadPeach().then(function(response){
                  console.info("peach loaded");
                  resolve("");
              });
          });
        });
           
		
      
    }


//FIXME FACTORISE
 var loadPeach = function(){
    return new Promise(function(resolve, reject){      
          var SPRITESHEET_URL_PEACH = "http://img11.hostingpics.net/pics/955485peachcry.png";
          var SPRITE_WIDTH_PEACH = 68;
          var SPRITE_HEIGHT_PEACH = 42;
          var NB_POSTURES_PEACH = 1;
          var NB_FRAMES_PER_POSTURE_PEACH = 1;
           // load the spritesheet
           var spritesheetPeach = new Image();
           spritesheetPeach.src = SPRITESHEET_URL_PEACH; 
           var peachSprites  = [];
            // Called when the spritesheet has been loaded
            spritesheetPeach.onload = function() {
               
               for(var i = 0; i < NB_POSTURES_PEACH; i++) {
                  var spritePeach = new Sprite();
                  spritePeach.extractSprites(spritesheetPeach, NB_POSTURES_PEACH, (i+1), 
                    NB_FRAMES_PER_POSTURE_PEACH, 
                    SPRITE_WIDTH_PEACH, SPRITE_HEIGHT_PEACH);
                  spritePeach.setNbImagesPerSecond(20);
                  peachSprites[i] = spritePeach;
              }
              peach.setSprites(peachSprites);
              resolve("");
           };
    });


 }

 var loadMario = function () {
     return new Promise(function(resolve, reject){
            var SPRITESHEET_URL_MARIO = "http://img15.hostingpics.net/pics/631826mariowalk.png";
            var SPRITE_WIDTH_MARIO = 24;
            var SPRITE_HEIGHT_MARIO = 40;
            var NB_POSTURES_MARIO = 8;
            var NB_FRAMES_PER_POSTURE_MARIO = 8;
             // load the spritesheet
             var spritesheetMario = new Image();
             spritesheetMario.src = SPRITESHEET_URL_MARIO; 
             var marioSprites  = [];

              // Called when the spritesheet has been loaded
              spritesheetMario.onload = function() {
                 
                 for(var i = 0; i < NB_POSTURES_MARIO; i++) {
                    var spriteMario = new Sprite();
                    spriteMario.extractSprites(spritesheetMario, NB_POSTURES_MARIO, (i+1), 
                      NB_FRAMES_PER_POSTURE_MARIO, 
                      SPRITE_WIDTH_MARIO, SPRITE_HEIGHT_MARIO);
                    spriteMario.setNbImagesPerSecond(20);
                    marioSprites[i] = spriteMario;
                }

                mario.setSprites(marioSprites);
                resolve("");
             };
      });
 }


 var start = function () {
   fps.init();


        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text
        ctx.font = "20px Arial";

        mario = new Mario(inputStates, ctx);
		    peach = new Peach(ctx);

        
        //  mario.enableGravity();
        // Create the different key and mouse listeners
        addListeners(inputStates, canvas);

        loadAssets(function () {
            // all assets (images, sounds) loaded, we can start the animation

            loadLevel();
            requestAnimationFrame(mainLoop);

        });
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};
