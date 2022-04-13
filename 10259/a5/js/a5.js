/* William Habsburg
   000869622
   Assignment 5 JavaScript file
   This is a helicopter game in SVG
*/

// mousemove event stuff found at https://stackoverflow.com/questions/1608498/capture-mouse-position-on-setinterval-in-javascript
// getBoundingClientRect found at https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/
// string padding from https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript

var score = 0;
var xPos = 0;
var gameElement;
var obsticles = [];
var obsticlesTop = [];
var drawOffset = 0;
var degrees = 0;
var gap = 200;
var scoreElement;
var timeInterval = 105;
var iTimer;
var timeTimer;
var helicopter;
var highscore = 0;
var timeStart;
var timeLeftElement;

/* Listens for "load" event
Sets up the variables, mousemove and onclick event handlers
*/
window.addEventListener("load", function() {
    gameElement = document.getElementById("background");
    scoreElement = document.getElementById("score");
    helicopter = document.getElementById("helicopter");
    var startGameButton = document.getElementById("startGame");
    var backgroundTop = gameElement.getBoundingClientRect().top;
    timeLeftElement = document.getElementById("timeLeft");

    /* Listens for "mousemove" event
    Controls the y postition of the helicopter SVG
    */
    gameElement.onmousemove = function(e) {
        let x = e.clientY - backgroundTop;
        if(x > 800)
            xPos = 800;
        else if(x < 42)
            xPos = 42;
        else
            xPos = x;
        helicopter.style.top = xPos + "px";
    }
    
    /* Listens for "onclick" event on the "Start game" button
    Sets up the score element and timers
    One timer to run the game
    2nd timer to change the speed of the first timer
    3rd timer to end the game
    */
    startGameButton.onclick = function(e) {
        scoreElement.innerText = "0";
        iTimer = window.setInterval(drawObsticles, timeInterval);
        timeTimer = window.setInterval(changeTimer, 8000);
        gameoverTimer = window.setTimeout(gameOver, 180000)
        timeStart = new Date();
    }
});

/* Listens for iTimer interval
Main handler for game logic and drawing
*/
function drawObsticles() {
    const svgNS = "http://www.w3.org/2000/svg";
    let dString = "";
    if(obsticles.length == 0) {
        for(let i = 0; i < 9; i++) {
            obsticles[i] = Math.floor(Math.sin((Math.PI / 180) * degrees) * (400 - gap)) + 400;
            obsticlesTop[i] = (800 - obsticles[i]) - gap;
            degrees += 10;
        }
    }
    let paths = gameElement.querySelectorAll( "path" );
    paths.forEach ( path => {
        path.parentNode.removeChild( path ); 
    } );
    dString = "m " + drawOffset + " " + (800 - obsticles[0]) + " h 100 ";
    for(let i = 1; i < obsticles.length; i++) {
        dString += "v " + (obsticles[i-1] - obsticles[i]) + " h 100 ";
    }
    let lines = document.createElementNS(svgNS, "path" );
    lines.setAttribute("class", "copter");
    lines.setAttribute("d", dString);
    gameElement.appendChild(lines);
    dString = "m " + drawOffset + " " + obsticlesTop[0] + " h 100 ";
    for(let i = 1; i < obsticlesTop.length; i++) {
        dString += "v " + (obsticlesTop[i] - obsticlesTop[i-1]) + " h 100 ";
    }
    lines = document.createElementNS(svgNS, "path" );
    lines.setAttribute("class", "copter");
    lines.setAttribute("d", dString);
    gameElement.appendChild(lines);
    drawOffset -=10;
    if(drawOffset < -90) {
        drawOffset = 0;
        for(let i = 0; i < obsticlesTop.length - 1; i++) {
            obsticles[i] = obsticles[i+1];
            obsticlesTop[i] = obsticlesTop[i+1];
        }
        obsticles[obsticles.length - 1] = Math.floor(Math.sin((Math.PI / 180) * degrees) * (400 - gap)) + 400;
        obsticlesTop[obsticlesTop.length - 1] = (800 - obsticles[obsticles.length - 1]) - gap;
        degrees += 10;
        gap -= 0.25;
        if(gap < 100)
            gap += 0.25;
    }
    if(xPos < (800-obsticles[1]) && xPos > obsticlesTop[1] + 40) {
        score += Math.floor(101 - (gap - 100));
        scoreElement.innerText = String(score).padStart(6, "0");
    }
    let timeleft = 180 + Math.floor((timeStart - (new Date())) / 1000);
    if(timeleft < 0)
        timeleft = 0;
    let timeString =  Math.floor(timeleft / 60) + ":" + String(timeleft % 60).padStart(2, "0");
    timeLeftElement.innerText = timeString;
}

/* Listens for timeTimer interval
Changes the interval of the iTimer timer
*/
function changeTimer() {
    clearInterval(iTimer);
    timeInterval -= 10;
    if(timeInterval < 25)
        timeInterval = 25;
    iTimer = window.setInterval(drawObsticles, timeInterval);
}

/* Listens for gameOverTimer interval
Stops the iTimer and timeTimer intervals
Checks for high score and displays it if necessary
Ends the game and sets up variables for next game
*/
function gameOver() {
    clearInterval(timeTimer);
    clearInterval(iTimer);
    if(score > highscore) {
        document.getElementById("highscore").innerText = "High Score: " + score + " points";
        highscore = score;
    }
    score = 0;
    obsticles = [];
    obsticlesTop = [];
    drawOffset = 0;
    degrees = 0;
    gap = 200;
    timeInterval = 205;
}