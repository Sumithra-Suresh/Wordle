
import { WORDS } from "./words.js";

//=========================================================================================================
// Global Variables
//
//
//=========================================================================================================

const NUMBER_OF_GUESSES = 6;
const WORD_LENGTH = 5;

let guessIndex = 0;
let boxIndex = 0;
let guessedString = "";
let randomWord = " ";


//=========================================================================================================
// Initialization
// Setting up a load handler to do the main startup work once the page is fully loaded.
//
//=========================================================================================================

window.addEventListener("load", startup, false);
//window.addEventListener("keypress",linkToGameKeyboard,false);

function startup() {

    // add event listeners for instructions pop-up open and close clicks
    document.querySelector(".instructions-btn").addEventListener("click", openInstructions);
    document.querySelector(".close-btn").addEventListener("click", closeInstructions);

    // add event listeners for restart new game.
    document.querySelector(".restart-btn").addEventListener("click",startNewGame); 

    initBoard();
    startNewGame();
}


//=========================================================================================================
// initBoard() will intialize the board and keyboard layout and add event listeners to the keyboard
// 
//
//=========================================================================================================

function initBoard() {

    let board = document.querySelector("#game-board");

    // create the game board - [NUMBER_OF_GUESSES * WORD_LENGTH]
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }

    // Create the keyboard
    let keyboardElem = document.querySelector("#keyboard");

    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]; 

    for(let i=0; i<keyboard.length; i++)
    {
        let keyboardRow = document.createElement("div");    // Create the row
        keyboardRow.classList.add("keyboard-row");          // Add the class name

        // Fill in the keyboard row elements
        for(let j=0; j<keyboard[i].length; j++){

            let keyTile = document.createElement("button"); // Create box element of button
            keyTile.innerText = keyboard[i][j];             // Assign the value [A-Z, Enter, Backspace]
            keyTile.classList.add("key-tile");              // Add the class name
            keyboardRow.appendChild(keyTile);               // Append it to the parent.

        }

        keyboardElem.appendChild(keyboardRow);              // Attach all the keyboard rows to the parent.

        // Add event listener to keyboard
        keyboardRow.addEventListener("click", screenKeyboardKeyHandler, false );
    }
}

//=========================================================================================================
// startNewGame()
// Generate a random word and reset the game board for new game
// Reset all the 
//=========================================================================================================

function startNewGame() {

    // Random words are stored as an array in a separate file.
    randomWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();   
    console.log(randomWord);        // For debug purpose 

    guessedString = "";
    guessIndex = 0;
    boxIndex = 0;              
    clearBoard(); 
}

//=========================================================================================================
// screenKeyboardKeyHandler() - screen keyboard event handler
// Handling same event for multiple elements. 
// Instead of applying event to each keys, event handling is applied to the parent and 'target event property' 
// is used to locate the child who fired that event.
// Improvement : for better performance we can stop the event bubbling above parent. 
//
//=========================================================================================================

function screenKeyboardKeyHandler(event){

    // The event listener is attached to the parent. So we need to exclude any parent clicks.   
    if(event.target !== event.currentTarget){   

        // Find the keypressed element: alphabets, Enter or backspace key
        let keypressed = event.target.innerHTML;

        if(keypressed==="Enter"){
            if(validateUserInput(guessedString)){   // validate User input
                checkGuess(guessedString);          // Check the guess          
            }
        }
        else if(keypressed === "⌫" ){              // remove the lastly entered character in the guessedString and letterBox.
            if(boxIndex >0){   
                guessedString = guessedString.slice(0,-1); // slice last character
                document.querySelectorAll(".letter-row")[guessIndex].children[--boxIndex].innerHTML = "";
            }
        }
        else{  //[A-Z]                                     

            if(guessedString.length === WORD_LENGTH)
            {
                displayMessage("Maximun "+WORD_LENGTH+" letters!");
            }
            else{
                // Update the letterBox and guessedString with the input character and increment the boxIndex counter.
                document.querySelectorAll(".letter-row")[guessIndex].children[boxIndex++].innerHTML = keypressed;
                guessedString += keypressed;
            }
        }

    }
}

//=========================================================================================================
// validateUserInput()
// Check the input length and check for alphabets only.
//
//=========================================================================================================

function validateUserInput(userInput){

    // Check the word length and display warning message. 
    if (userInput.length < WORD_LENGTH) {
        displayMessage("Not enough letters!");
        return false;
    }

    // Check for alphabets only
    //^[a-zA-Z]+$ matches only strings that consist of one or more letters only 
    // (^ and $ mark the begin and end of a string respectively).

    var letters = /^[A-Za-z]+$/;

    if(!userInput.match(letters))
    {
        displayMessage("Enter alphabets only!");
        return false;
    }

    return true;
}

//=========================================================================================================
// checkGuess()
// Check the input string against the random string and change the box color accordingly.
// Got three different CSS class for pattern matching(present, correct and absent). 
// Set the corresponding class names for the boxes.
//
//=========================================================================================================

function checkGuess(userInput) {

    let greenCount = 0; 
    let currentRow = document.querySelectorAll(".letter-row")[guessIndex];

    // Check each character of the input word against the random word using indexOf().
    for(let i=0; i<WORD_LENGTH; i++) {
        
        let charPosition = randomWord.indexOf(userInput[i]); 
        let classname = "";

        if(charPosition === -1) // character not in the random word.
        {
            classname = "absent";
        }
        else{
            // Character is in the random word. Now need to match the indexes.
            if(randomWord[i] === userInput[i]){
                classname = "correct";
                greenCount++;
            }
            else{
                classname = "present";
            }
        }

        // update gameboard and Keyboard with the corresponding color.
        currentRow.children[i].classList.add(classname);
        updateKeyboard(userInput[i], classname);
    }
    
    // if all the characters are green, it is the winning word.

    if( greenCount === WORD_LENGTH ) {
        displayMessage("You Win! ");
    }
    else{
        updateCounters();
    }
}

//=========================================================================================================
// displayMessage()
// Display Win or loss or any input error message 
//
//=========================================================================================================

function displayMessage(text){
    document.getElementById("message").innerHTML = text;
    setTimeout(() => {
        document.getElementById("message").innerHTML = "";
    }, 1500);  
}

//=========================================================================================================
// updateKeyboard()
// Update the keyboard with the selected pattern color for the alphabets.
//
//=========================================================================================================

function updateKeyboard(key, classname){

    let keyboardRow = document.querySelectorAll(".keyboard-row");

    keyboardRow.forEach((row) => {

        let keyTiles = row.childNodes;

        keyTiles.forEach((tile) => {

            if(tile.innerText === key){
                tile.classList.add(classname);
            }

        });

    });
}

//=========================================================================================================
// updateCounters() 
// Update all the counters for next guess.
//
//=========================================================================================================

function updateCounters(){
    // increment rowIndex. set the boxIndex to 0.
    guessIndex++;
    boxIndex = 0;
    guessedString = "";

    if (guessIndex >= NUMBER_OF_GUESSES)
    {
        displayMessage("Maximum attempt reached! Nice try! ");
        startNewGame();
    }

}

//=========================================================================================================
// Remove all the pattern matching colors(green, yellow and gray) and set the game board and keyboard to 
// their default classes. 
// Clear all the innerText field in the game board.
//
//=========================================================================================================

function clearBoard() {

    // Reset game board
    let letterBox = document.querySelectorAll(".letter-box");

    letterBox.forEach( (box) => {
        box.innerText = "";
        box.className ='';  
        box.className = "letter-box";
    });

    // Reset keyboard
    let keyboardRow = document.querySelectorAll(".keyboard-row");

    keyboardRow.forEach( (row) => {

        let keyTiles = row.childNodes;

        keyTiles.forEach( (tile) => {
            tile.className='';
            tile.classList.add("key-tile");
        });

    });
}


//=========================================================================================================
// Game Instructions
// pop up window to display the game instructions.
//
//=========================================================================================================

function openInstructions(){
    document.querySelector(".instructions").style.display="block";
    document.querySelector(".container").style.display="none";
}

function closeInstructions(){
    document.querySelector(".instructions").style.display="none";
    document.querySelector(".container").style.display="block";
}
