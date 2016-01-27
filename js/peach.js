// Classe Peach
var Peach = function(ctx, w, h){  

    var peachSprites = []; 
	var currentDirection = 0;
    
    var option = {
        x: w,
        y: h,
        width: 68,
        height: 42,
		direction: 0
    }; 

       // Functions for drawing
       var drawMe = function() {
        // save the context
        ctx.save();
        
        // draw Peach
		peachSprites[option.direction].drawStopped(ctx, option.x, option.y, 100, 1);
        ctx.restore();
    };
    var setPosition = function(newX, newY){
        option.x = newX;
        option.y = newY;
    };

    var setSprites = function(sprites){
        peachSprites = sprites;
    };
    var startPosition = function() {
      option.x = 10;
      option.y = 10;
  };

  return {
      option: option,
      draw: drawMe,
      startPosition: startPosition,
      setPosition : setPosition,
      setSprites : setSprites
  };
};