// Classe Mario
var Mario = function(inputStates, ctx){  

     // positions
    var DIR_LEFT = 6;
    var DIR_RIGHT = 2;
    var DIR_UP = 4;
    var DIR_DOWN = 0;
    var DIR_RIGHT_UP = 3;
    var DIR_RIGHT_DOWN = 1;
    var DIR_LEFT_UP = 5;
    var DIR_LEFT_DOWN = 7;
    var marioSprites = []; 
	var currentDirection = 0;
    
    var option = {
        dead: false,
        x: 10,
        y: 10,
        width: 24,
        height: 40,
        scaleX : 1,
       scaleY : 1,
        collisionBox : false,
        gravity : false,
		direction: DIR_DOWN,
        speed: 300 // pixels/s this time !
    }; 

       // Functions for drawing the monster
       var drawMe = function() {
        // save the context
        ctx.save();
        if(option.collisionBox){
          ctx.rect(option.x, option.y, option.width, option.height);
          ctx.stroke ();    
        }
        
        // draw Mario
		if(option.speedX === 0 && option.speedY === 0)
			marioSprites[option.direction].drawStopped(ctx, option.x, option.y, 100, 1);
		else 
			marioSprites[option.direction].draw(ctx, option.x, option.y, 100, 1);
        ctx.restore();
    };
    var setPosition = function(newX, newY){
        option.x = newX;
        option.y = newY;
    };

    var updatePosition = function(delta) {
		var VITESSE_DIAGONALE = 1.2;
		var val = 0;
	
        option.speedX = option.speedY = 0;
		
        // check inputStates

        if(option.gravity && option.speedY < 300){
            option.speedY = option.speedY + 100;
        }
		
		if(inputStates.up) val |= 0x1;
		if(inputStates.left) val |= 0x2;
		if(inputStates.right) val |= 0x4;
		if(inputStates.down) val |= 0x8;
		
		
		switch(val) {
			case 1:
				option.speedY = -option.speed;
				option.direction = DIR_UP;
				break;
			case 2:
				option.speedX = -option.speed;
				option.direction = DIR_LEFT;
				break;
			case 3:
				option.speed /= VITESSE_DIAGONALE;
				option.speedY = -option.speed;
				option.speedX = -option.speed;
				option.direction = DIR_LEFT_UP;
				break;
			case 4:
				option.speedX = option.speed;
				option.direction = DIR_RIGHT;
				break;
			case 5:
				option.speed /= VITESSE_DIAGONALE;
				option.speedX = option.speed;
				option.speedY = -option.speed;
				option.direction = DIR_RIGHT_UP;
				break;
			case 8:
				option.speedY = option.speed;
				option.direction = DIR_DOWN;
				break;
			case 10:
				option.speed /= VITESSE_DIAGONALE;
				option.speedX = -option.speed;
				option.speedY = option.speed;
				option.direction = DIR_LEFT_DOWN;
				break;
			case 12:
				option.speed /= VITESSE_DIAGONALE;
				option.speedX = option.speed;
				option.speedY = option.speed;
				option.direction = DIR_RIGHT_DOWN;
				break;
		}
        if (inputStates.mousedown) {
            option.speed = 300;
        } 
        else {
          option.speed = 100;
        } 

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        option.x += calcDistanceToMove(delta, option.speedX);
        option.y += calcDistanceToMove(delta, option.speedY);
    }; 

    var enableGravity = function() {
        option.gravity = true;
    };

    var setSprites = function(sprites){
        marioSprites = sprites;
    };
    var startPosition = function() {
      option.x = 10;
      option.y = 10;
  };

  return {
      option: option,
      draw: drawMe,
      updatePosition: updatePosition,
      startPosition: startPosition,
      setPosition : setPosition,
      enableGravity : enableGravity,
      setSprites : setSprites
  };
};