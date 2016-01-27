-(function(){

    var FPS = function(){
     // vars for counting frames/s, used by the measureFPS function
        var frameCount = 0;
        var lastTime;
        var fpsContainer;
        var fps;

        var initFPSCounter = function() {
            // adds a div for displaying the fps value
            fpsContainer = document.createElement('div');
            document.body.appendChild(fpsContainer);
        };
        
        var measureFPS = function (newTime) {

            // test for the very first invocation
            if (lastTime === undefined) {
                lastTime = newTime;
                return;
            }

            //calculate the difference between last & current frame
            var diffTime = newTime - lastTime;

            if (diffTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = newTime;
            }

            //and display it in an element we appended to the 
            // document in the start() function
            fpsContainer.innerHTML = '<b>What the goal?</b><ul><li>Save Princess Peach as fast as you can</li><li><b>DON\'T TOUCH THE WALLS</b></li></ul><b>How to play?</b><ul><li>Move with arrow keys</li><li>Go to the main menu with escape key</li></ul>';
            fpsContainer.innerHTML += 'FPS: ' + fps;
            frameCount++;
        };



        
        return {
            init: initFPSCounter,
            measure: measureFPS
        };
    }
    window.fps = new FPS();

})();    
