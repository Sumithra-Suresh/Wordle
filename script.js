
import { WORDS } from "./words.js";

//=========================================================================================================
// Global Variables
//
//
//=========================================================================================================

const NUMBER_OF_GUESSES = 6;
const WORD_LENGTH = 5;

let guessedWords = [];
let randomWord = " ";
let win = false;


//=========================================================================================================
// Initialization
// Setting up a load handler to do the main startup work once the page is fully loaded.
//
//=========================================================================================================

window.addEventListener("load", startup, false);

function startup() {

    // add event listener for button click and 'Enter' keys in keyboard to get the input.
    document.querySelector(".enter-btn").addEventListener('click', getUserInput, false);
    document.getElementById("input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getUserInput();
        }
    });
 
    // add event listener to restart the game
    document.getElementById("restart-btn").addEventListener("click",startNewGame); 
    

    // add event listeners to instruction modal
    document.getElementById("modal-btn").addEventListener("click", openModal);
    document.getElementsByClassName("closeBtn")[0].addEventListener("click", closeModal);

    startNewGame();
}

//=========================================================================================================
// startNewGame()
// Generate a random word and reset the game board.
//
//=========================================================================================================

function startNewGame() {

    randomWord = getRandomWord();   // get the random word
    guessedWords = [];              // clear the guessed word
    win = false;
    clearUserInput();               // clear all fields
    clearMsg();                    
    clearBoard();
    console.log(randomWord);        // For debug purpose
}

//=========================================================================================================
// validateUserInput()
// Check the input length and check for alphabets only.
//
//=========================================================================================================

function validateUserInput(userInput){

    // Check the word length and display warning message. 
    if (userInput.length != WORD_LENGTH) {
        document.getElementById("message").innerHTML = "Not enough letters!";
        setTimeout(() => {
            clearUserInput();
            clearMsg();
        }, 1000);  
        return false;
    }

    // Check for alphabets only
    //^[a-zA-Z]+$ matches only strings that consist of one or more letters only 
    // (^ and $ mark the begin and end of a string respectively).

    var letters = /^[A-Za-z]+$/;

    if(!userInput.match(letters))
    {
        document.getElementById("message").innerHTML = "Enter alphabets only!"
        setTimeout(() => {
            clearUserInput();
            clearMsg();
        }, 1000);
        return false;
    }

    return true;
}


//=========================================================================================================
// Reset the input fields, Message field and game board
// 
//
//=========================================================================================================

const clearUserInput = () => document.getElementById("input").value="";

const clearMsg = () => document.getElementById("message").innerHTML = " ";

const clearBoard = () => document.getElementById("game-board").innerHTML = " "; 


//=========================================================================================================
// getUserInput()
//  Get and validate the user input.
//
//=========================================================================================================

function getUserInput(){

    // User allowed only 'NUMBER_OF_GUESSES' time
    if( guessedWords.length < NUMBER_OF_GUESSES ) {

        // Random words are in lowercase. So store the input in lowercase.
        let userInput = document.getElementById("input").value.toLowerCase();

        if(validateUserInput(userInput)){

            // Check the input string against the random string
            let result = checkGuess(userInput); 
        
            guessedWords.push(result.toUpperCase());

            // display the all the guessed words in rows.
            document.getElementById("game-board").innerHTML +=  guessedWords[guessedWords.length-1]+"<br />";

            // clear user input fileds
            clearUserInput();
            clearMsg();
        }
    }   
    else{
        document.getElementById("message").innerHTML = "Maximum attempt reached! Nice try! ";

        setTimeout(() => {
            startNewGame();
        }, 1000);  
        
    }

    // Check the guessed word for winning
    if (win) {
        
        document.getElementById("message").innerHTML = "You Win! "; // Display win message
        setTimeout(() => {
            startNewGame();
        }, 1000); 
        
    }

}

//=========================================================================================================
// getRandomWord()
//  Generate random words. Random words are stored as an array in a separate file.
//
//=========================================================================================================

function getRandomWord() {

    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

//=========================================================================================================
// checkGuess()
// Check the input string against the random string and change the letter color accordingly.
//
//=========================================================================================================

function checkGuess(userInput) {

    let checkedString=[];
    let greenCount = 0;
        
    for(let i=0; i<WORD_LENGTH; i++){

        let charPosition = randomWord.indexOf(userInput[i]);
        let color = "black";

        if(charPosition === -1)
        {
            // character not in the random word. Mark it black
            color = "black";
        }
        else{
            // Character is in the random word. Now need to match the indexes.
            if(randomWord[i] === userInput[i]){
                color = "green";
                greenCount++;
            }
            else{
                color = "orange";
            }
        }
        
        let j = userInput[i].fontcolor(color);       
        checkedString.push(j);
    }

    // if all the characters are green, it is the winning word.
    win = (greenCount===5) ? true : false;

    // convert the character array to string and return.
    return checkedString.join("");

}

//=========================================================================================================
// Modal Instruction
// pop up window to display the game instructions.
//
//=========================================================================================================

function openModal(){
    let modal = document.getElementById("modal-instruction");
    let mainContainer = document.getElementsByClassName("game-wrapper")[0];

    modal.style.display="block";
    mainContainer.style.display="none";
}

function closeModal(){
    let modal = document.getElementById("modal-instruction");
    let mainContainer = document.getElementsByClassName("game-wrapper")[0];

    modal.style.display="none";
    mainContainer.style.display="block";
}


