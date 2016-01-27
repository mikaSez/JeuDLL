
	// Classe Obstacle
	var Obstacle = function(x, y, w, h, canvas, ctx) {
		var option = {
            defaults: {
                x : x,
                y : y
            },
			x: x,
			y: y,
			width: w,
			height: h,
			speedX: 0,
			speedY: 0,
            scaleX : 1,
            scaleY : 1,
			color: 'black'
		};
		
        var reset = function(){
            option.x = option.defaults.x;
            option.y = option.defaults.y;

        };
        var speed = function(x, y){
            option.speedX = x || 0;
            option.speedY = y || 0;
        };
		var draw = function() {
		    ctx.save();
            ctx.fillStyle = option.color;
            ctx.fillRect(option.x, option.y, option.width, option.height);
            ctx.restore();
		};
		var invertX = function() {
            option.speedX=-option.speedX;
            option.x += calcDistanceToMove(delta, option.speedX);
        };
        var invertY = function() {
            option.speedY=-option.speedY;
            option.y += calcDistanceToMove(delta, option.speedY);
        };
		var move = function(delta) {
            option.x += calcDistanceToMove(delta, option.speedX);
            option.y += calcDistanceToMove(delta, option.speedY);
            var col = checkCollision(this, canvas);
            if(col.collision){
                if(col.x){
                    invertX();
                }
                if(col.y){
                    invertY();
                }
            }

        };
		
		return {
			option: option,
			draw: draw,
			move: move,
            reset : reset,
            speed : speed
		};
	};