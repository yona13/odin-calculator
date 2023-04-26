/** Main Script for Calculator Project */

let decimalPressed = false;  // prevents adding more than 1 decimal point

/* Functions */

/* Get Digit Function */
function getDigit(value) {
    if (value.includes("digit")) {
        let digit = value.replace("digit-", "");
        return parseInt(digit);
    }
    return null;
}

function changeMargin(enlarge=true) {
    inputCell.setAttribute("style", `margin: ${enlarge ? 6 : 0}px 0px`);
}

/* Can Add Input Character */
function canAddCharacter() {
    return inputCell.offsetWidth < MAX_WIDTH;
}

/* Add Function Character Function */
function addFunctionCharacter(value) {
    if (value == "*" || value == "/") {
        changeMargin(false);
        return String.fromCharCode(value == "*" ? 215 : 247);
    } else return value;
}

/* Remove String Character from Input */
function backspace(index=0) {
    if (inputText.charCodeAt(inputCell.textContent.length - 1 - index) == 215 || inputCell.textContent.charCodeAt(inputCell.textContent.length - 1 - index) == 247) 
        changeMargin();
    inputText = inputText.substring(0, inputText.length - 1 - index);
    updateInput();
}

/* Clear Function */
function clear() {
    changeMargin();
    inputText = "";
    solution = 0;
    inputCell.textContent = "";
    result.textContent = "";
}

/* Update Input Function */
function updateInput() {
    inputCell.textContent = inputText;
}

/* Update Result Function */
function updateResult() {
    console.log(inputText)
    solution = evaluate(inputText + "|", answer);
    shouldReset = !isNaN(solution);
    if (shouldReset) answer = solution;
    result.textContent = solution;
}

/* Keydown Event Listener Function */
function keypressListener(event) {
    if (shouldReset) {
        clear();
        shouldReset = false;
    }

    // Numeric key Pressed
    if ((!isNaN(event.key) || event.key == ".") && canAddCharacter()) {
        inputText += event.key;
        updateInput();
    }

    // Function Key Pressed
    if (isFunctionKey(event.key) && canAddCharacter()) {
        inputText += addFunctionCharacter(event.key);
        updateInput();
    }
    
    // Back Space Pressed
    if (event.key == "Backspace") 
        backspace();

    // Clear Pressed
    if (event.key.toLowerCase() == "c") 
        clear();

    // Enter Pressed
    if (event.key == "Enter")
        updateResult();
}

/* Button Pressed Event Listener Function */
function pressButton(event) {
    if (shouldReset) {
        clear();
        shouldReset = false;
    }

    // console.log(event.target.id)
    const digit = getDigit(event.target.id);

    // Numeric Button Pressed
    if (digit != null && canAddCharacter()) {
        inputText += digit;
        updateInput();
    }
    
    // Decimal Point Button Pressed
    else if (event.target.textContent == "." && canAddCharacter()) {
        inputText += ".";
        updateInput();
    }

    // Function Button Pressed
    else if (isFunctionKey(event.target.id, true) && canAddCharacter()) {
        const functionKey = FUNCTION_KEYS[FUNCTION_STRS.indexOf(event.target.id)];
        inputText += addFunctionCharacter(functionKey);
        updateInput();
    }
    
    // Delete Button Pressed
    if (event.target.textContent == "DEL") 
        backspace();

    // All Clear Button Pressed
    if (event.target.textContent == "AC") 
        clear();

    if (event.target.id == "pi" && canAddCharacter()) {
        inputText += String.fromCharCode(960);
        changeMargin(false);
        updateInput();
    }

    if (event.target.id == "answer" && canAddCharacter(true)) {
        inputText += "Ans"
        updateInput();
    }

    // Equate Button Pressed
    if (event.target.id == "equals")
        updateResult();
}

/* Variables */
// const calculator = require("./calculator")
let inputText = "";
let resultText = "";
let solution = 0;
let answer = 0;
let idlePromptToggle = true;
let shouldReset = false;

const input = document.querySelector(".input");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".numeric");
const cancels = document.querySelectorAll(".cancel");
const idlePrompt = document.createElement("div");
const inputCell = document.createElement("div");
changeMargin();
inputCell.className = "data-cell";
idlePrompt.className = "idle-prompt-cell";
idlePrompt.textContent = "|"
input.appendChild(inputCell);
input.appendChild(idlePrompt);

// Input & Result Screen Divisors
const DATA_CELL_COUNT = 14;
const MAX_WIDTH = 285;
const BLINK_INTERVAL = 1000;

// Setup
if (idlePromptToggle) setInterval(function () {
    idlePrompt.style.visibility = (idlePrompt.style.visibility == "hidden" ? "" : "hidden");
}, BLINK_INTERVAL);
buttons.forEach(button => {button.addEventListener('click', pressButton);});
cancels.forEach(button => {button.addEventListener('click', pressButton);});
document.body.addEventListener("keydown", keypressListener);