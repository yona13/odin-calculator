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

/* Update Input Display Function */
function updateInputCells() {
    input.innerHTML = "";
    for (var i = inputCells.length - 1; i >= 0; i--) {
        const obj = inputCells[i];
        input.appendChild(obj);
    }

    // Finally append idle-prompt object
    input.appendChild(idlePrompt);
    decimalPressed = false;
}

/* Can add Input Cell Function */
function canAddInputCell() {
    let totalWidth = 0;
    for (const obj of inputCells) totalWidth += obj.className.includes("ascii") ? 26 : 20;
    return totalWidth < MAX_WIDTH;
}

/* Add Input Cell Function */
function addInputCell(value) {
    const newCell = document.createElement("div");
    newCell.className = "data-cell";
    newCell.textContent = value + "  ";
    inputCells.unshift(newCell);
    updateInputCells();
}

/* Can add Decimal Point Function */
function canAddDecimal() {
    if (inputCells.length > 0) return !decimalPressed && inputCells[0].className == "data-cell";
    return false;
}

/* Add Decimal Point Function */
function addDecimal() {
    if (canAddDecimal()) {
        inputCells[0].textContent = inputCells[0].textContent.trim() + ".";
        updateInputCells();
        decimalPressed = true;
    }
}

/* Is Function Key Function */
function isFunctionKey(value, isString=false) {
    if (!isString) return FUNCTION_KEYS.includes(value);
    else return FUNCTION_STRS.includes(value);
}

/* Add Function Cell Function */
function addFunctionCell(value) {
    const newCell = document.createElement("div");
    newCell.className = "function-cell";
    if (value == "*" || value == "/") {
        newCell.className += " ascii";
        newCell.textContent = String.fromCharCode(value == "*" ? 215 : 247);
    } else newCell.textContent = value;
    inputCells.unshift(newCell);
    updateInputCells();
}

/* Remove Input Cell Function */
function removeInputCell(index=0) {
    if (inputCells.length > 0) {
        if (inputCells[index].textContent.includes(".")) inputCells[index].textContent = parseInt(inputCells[index].textContent) + " ";
        else {
            inputCells.splice(index, 1);
            updateInputCells();
        }
    }
}

/* Clear Input Cells Function */
function clearInputCells() {
    inputCells = [];
    updateInputCells();
    result.textContent = "";
}

/* Check Syntax Function */
function checkSyntax() {
    return true;
}

function parseOperations(operation) {
    if (typeof(operation.b) == "number") {
        if (operation.func == "+")
            return add(operation.a, operation.b);
        else if (operation.func == "-")
            return subtract(operation.a, operation.b);
        else if (operation.func == "*")
            return multiply([operation.a, operation.b]);
        else if (operation.func == "/")
            return Math.abs(operation.b) > 0 ? multiply([operation.a, 1 / operation.b]) : "NOT DEFINED";
    } else {
        return "MATHS ERROR";
    }
}

function createOperations(from) {
    let currentValue = "";
    let operation = {a: 0, func: "", b: 0};

    for (var i = from; i >= 0; i--) {
        const obj = inputCells[i];
        // Check if Content is a Number
        if (obj.className == "data-cell") currentValue += obj.textContent.trim();
        
        // Otherwise, it would be a Function
        else {
            if (operation.func === "") {
                console.log(currentValue);
                operation.a = parseFloat(currentValue);
                currentValue = "";
                const charCode = obj.textContent.charCodeAt(0);
                
                // Check if Function is + or -
                if (isFunctionKey(obj.textContent)) {
                    operation.func = obj.textContent;
                } 
                
                // Check if Function is 
                else if (charCode == 215 || charCode == 247) {
                    operation.func = charCode == 215 ? "*" : "/";
                }
            } else {
                operation.b = createOperations(i);
                break;
            }
        }
    }

    if (operation.b == 0) {
        operation.b = parseInt(currentValue);
    }

    console.log(`Input: ${operation.a} ${operation.func} ${operation.b}`);
    return operation;
}

/* Evaluate Input Cells Function */
function evaluate() {
    if (checkSyntax()) {
        shouldReset = true;
        console.log(`Length: ${inputCells.length - 1}`)
        result.textContent = parseOperations(createOperations(inputCells.length - 1));
    } else {
        result.textContent = "Syntax ERROR"
    }
}

/* Keydown Event Listener Function */
function keypressListener(event) {
    if (shouldReset) {
        clearInputCells();
        shouldReset = false;
    }

    // console.log(event.key);

    // Numeric key Pressed
    if (!isNaN(event.key) && canAddInputCell()) 
        addInputCell(event.key);

    // Decimal Point Pressed
    if (event.key == ".") 
        addDecimal();

    // Function Key Pressed
    if (isFunctionKey(event.key) && canAddInputCell()) 
        addFunctionCell(event.key);
    
    // Back Space Pressed
    if (event.key == "Backspace") 
        removeInputCell();

    // Clear Pressed
    if (event.key.toLowerCase() == "c") 
        clearInputCells();

    // Enter Pressed
    if (event.key == "Enter")
        evaluate();
}

/* Button Pressed Event Listener Function */
function pressButton(event) {
    if (shouldReset) {
        clearInputCells();
        shouldReset = false;
    }

    // console.log(event.target.id)
    const digit = getDigit(event.target.id);

    // Numeric Button Pressed
    if (digit != null && canAddInputCell())
        addInputCell(digit);
    
    // Decimal Point Button Pressed
    else if (event.target.textContent == ".")
        addDecimal();

    // Function Button Pressed
    else if (isFunctionKey(event.target.id, true) && canAddInputCell()) {
        const functionKey = FUNCTION_KEYS[FUNCTION_STRS.indexOf(event.target.id)];
        addFunctionCell(functionKey);
    }
    
    // Delete Button Pressed
    if (event.target.textContent == "DEL") 
        removeInputCell();

    // All Clear Button Pressed
    if (event.target.textContent == "AC") 
        clearInputCells();

    // Equate Button Pressed
    if (event.target.id == "equals")
        evaluate();
}

/* Variables */
// const calculator = require("./calculator")
const input = document.querySelector(".input");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".numeric");
const cancels = document.querySelectorAll(".cancel");
const idlePrompt = document.createElement("div");
let inputCells = [];
idlePrompt.className = "idle-prompt-cell";
idlePrompt.textContent = "|"
updateInputCells();

let idlePromptToggle = true;
let shouldReset = false;

// Input & Result Screen Divisors
const DATA_CELL_COUNT = 14;
const MAX_WIDTH = 300;
const BLINK_INTERVAL = 1000;
const FUNCTION_KEYS = ["+", "-", "*", "/"];
const FUNCTION_STRS = ["add", "minus", "multiply", "divide"];

// Setup
if (idlePromptToggle) setInterval(function () {
    idlePrompt.style.visibility = (idlePrompt.style.visibility == "hidden" ? "" : "hidden");
}, BLINK_INTERVAL);
document.body.addEventListener("keydown", keypressListener);
buttons.forEach(button => {button.addEventListener('click', pressButton);});
cancels.forEach(button => {button.addEventListener('click', pressButton);});