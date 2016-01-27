   // We can add the other collision functions seen in the
   // course here...
   
   // Collisions between rectangle and circle
    function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
        var testX = cx;
        var testY = cy;

        if (testX < x0)
            testX = x0;
        if (testX > (x0 + w0))
            testX = (x0 + w0);
        if (testY < y0)
            testY = y0;
        if (testY > (y0 + h0))
            testY = (y0 + h0);

        return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
    }


    function testCollisionWithWalls(ball, w, h) {
        // left
        if (ball.x < ball.radius) {
            ball.x = ball.radius;
            ball.angle = -ball.angle + Math.PI;
        }
        // right
        if (ball.x > w - (ball.radius)) {
            ball.x = w - (ball.radius);
            ball.angle = -ball.angle + Math.PI;
        }
        // up
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.angle = -ball.angle;
        }
        // down
        if (ball.y > h - (ball.radius)) {
            ball.y = h - (ball.radius);
            ball.angle = -ball.angle;
        }
    }
	

  function checkCollision(object, canvas) {
      var x=false, y=false, collision=false;
        // collision avec le mur du haut
       if(object.option.y <= 0 || (object.option.y + (object.option.height*object.option.scaleY)) >= canvas.height){
          collision = true;
          y = true;
       }
        // collision avec le mur gauche
       if(object.option.x <= 0 || (object.option.x + (object.option.width*object.option.scaleX)) >= canvas.width){
             collision = true;
             x = true;
        } 
        return {
          collision,
          x,
          y
        };
    } 
	// check collision between Mario and walls
	function checkCollisionWall(monster, canvas) {
        // collision avec le mur du haut
       if(monster.option.y <= 0){
         // Retour à la case départ et MORT
			monster.option.x = 20;
			monster.option.y = 20;
			monster.option.dead = true;
       }
        // collision avec le mur gauche
       if(monster.option.x <= 0){
          // Retour à la case départ et MORT
			monster.option.x = 20;
			monster.option.y = 20;
			monster.option.dead = true;
        } 
        // collision avec le mur du bas
        if((monster.option.y + (monster.option.height*monster.option.scaleY)) >= canvas.height){
          // Retour à la case départ et MORT
			monster.option.x = 20;
			monster.option.y = 20;
			monster.option.dead = true;        }
        // collision avec le mur droit
        if((monster.option.x + (monster.option.width*monster.option.scaleX)) >= canvas.width){
          // Retour à la case départ et MORT
			monster.option.x = 20;
			monster.option.y = 20;
			monster.option.dead = true;
        }
    }
	
	// Collisions between aligned rectangles
    function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
      
      if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
        return false; // No horizontal axis projection overlap
      if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
        return false; // No vertical axis projection overlap
      return true;    // If previous tests failed, then both axis projections
                      // overlap and the rectangles intersect
    }
	
	function checkCollisionObstacles(monster, obstacles) {
	      // collision avec obstacles

      for(var i=0; i < obstacles.length; i++) {
        var o = obstacles[i];
          if(rectsOverlap(o.option.x, o.option.y, o.option.width, o.option.height, 
                          monster.option.x, monster.option.y, monster.option.width*monster.option.scaleX, monster.option.height*monster.option.scaleY)) {
      
          		return true;
           }
      }
      return false;
	}
