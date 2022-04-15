/* William Habsburg
   000869622
   Assignment 4 JavaScript file
   This is a Dice game played against the computer
*/


// variables needed throughout the game
let playerTotal = 0;
let computerTotal = 0;
let diceRoll = 1;
let userName = "";
let playerWins = 0;
let computerWins = 0;
let ties = 0;
let playerDice = [0, 0, 0, 0, 0];
let computerDice = [0, 0, 0, 0, 0];
let computerKeep = [false, false, false, false, false];

/* onLoad event listener
   Creates event handlers for player name and for gameplay
*/
window.addEventListener("load", function() {
    clearValues();

    /* Listens for "submit" event on main form (player name)
       Sets up the game with player name in the appropriate places
    */
    document.forms.setupForm.addEventListener("submit", function(event) {
        let success = true;
        event.preventDefault();
        userName = document.forms.setupForm.name.value;
        let unHint = document.getElementById("usernameHint");
        unHint.innerHTML = "";
        if(userName.length < 4 || userName.length > 8) {
            unHint.innerHTML = "<p>Username must be between 4 and 8 characters</p>";
            success = false;
        }
        let charCheck = userName[0].toLowerCase();
        for(let counter = 1; counter < userName.length; counter++) {
            let check2 = userName[counter].toLowerCase();
            if(check2 <= charCheck || check2 < "a" || check2 > "z") {
                unHint.innerHTML += "<p>Each letter of the username must be alphabetically larger then the previous.  See the rules</p>";
                success = false;
                break;
            }
            charCheck = userName[counter].toLowerCase();
        }

        if(success) {
            userName = userName[0].toUpperCase() + userName.substr(1);
            document.getElementById("setup").style.display = "none";
            document.getElementById("game").style.display = "block";
            document.getElementById("player1Name").innerText = userName;
            document.getElementById("playerStatName").innerText = userName;
        }
    });

    /* Listens for the "click" event on the gameplay section
       Allows 3 rolls of the dice and resets the game after that
    */
    document.getElementById("playerRoll").addEventListener("click", function(event) {
        let rollButton = document.getElementById("playerRoll");
        if(diceRoll == 0) {
            clearValues();
            diceRoll = 1;
            rollButton.innerText = "Role #" + diceRoll;
        } else {
            rollButton.style.visibility = "hidden";
            var myTimer = setInterval(rollDice, 50);
            setTimeout(function() {
                window.clearInterval(myTimer);
                for(let counter = 0; counter < 5; counter++) {
                    if(computerDice[counter] < 4) {
                        computerKeep[counter] = false;
                    } else {
                        computerKeep[counter] = true;
                    }
                    document.getElementById("ComputerK" + (counter + 1)).checked = computerKeep[counter];
                }
                diceRoll++;
                if(diceRoll <= 3) {
                    rollButton.innerText = "Role #" + diceRoll;
                } else {
                    diceRoll = 0;
                    if(playerTotal > computerTotal) {
                        playerWins++;
                        rollButton.innerText = "You Win!!!  Play Again?";
                    } else if(playerTotal == computerTotal) {
                        ties++;
                        rollButton.innerText = "Tie Game.  Play Again?";
                    } else {
                        computerWins++;
                        rollButton.innerText = "Computer Wins.  Play Again?";
                    }
                    document.getElementById("playerWins").innerText = playerWins;
                    document.getElementById("computerWins").innerText = computerWins;
                    document.getElementById("ties").innerText = ties;
                }
                rollButton.style.visibility = "visible";
            }, 1000);
        }
    });
});

/* This function simulates a dice roll with random numbers

*/
function rollDice() {
    playerTotal = 0;
    computerTotal = 0;
    for(counter = 1; counter <= 5; counter++) {
        let player = document.getElementById("PlayerD" + counter);
        let computer = document.getElementById("ComputerD" + counter);
        if(document.getElementById("PlayerK" + counter).checked == false) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            player.innerText = randomNumber;
            playerTotal += randomNumber;
            playerDice[counter - 1] = randomNumber;
        } else {
            playerTotal += playerDice[counter - 1];
        }
        if(computerKeep[counter - 1] == false) {
            randomNumber = Math.floor(Math.random() * 6 + 1);
            computer.innerText = randomNumber;
            computerTotal += randomNumber;
            computerDice[counter - 1] = randomNumber;
        } else {
            computerTotal += computerDice[counter - 1];
        }
    }
    document.getElementById("PlayerTotal").innerText = playerTotal;
    document.getElementById("ComputerTotal").innerText = computerTotal;
}

/* This fucntion resets elements and a variable.
   It is necessary to reset these values after pressing F5 on the browser
*/
function clearValues() {
    for(counter = 1; counter <= 5; counter++) {
        document.getElementById("PlayerK" + counter).checked = false;
        document.getElementById("ComputerK" + counter).checked = false;
        document.getElementById("PlayerD" + counter).innerText = "0";
        document.getElementById("ComputerD" + counter).innerText = "0";
    }
    computerKeep = [false, false, false, false, false];
}