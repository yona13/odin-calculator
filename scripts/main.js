/* -- Variables -- */

let operation = generateOperations([]);
let answer = 0;
let inputValues = [];
let resetResult = false;
const input = document.querySelector(".input-text");
const inputScreen = document.querySelector(".input");
const result = document.querySelector(".result-text");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {button.addEventListener('click', buttonPressListener)});
window.addEventListener('keydown', keyPressListerner);

/* -- Functions -- */

/**
 * Can Add Function
 * 
 * Returns true if input width is less than screen width
 * @returns {boolean}
 */
function canAdd() {
    return input.offsetWidth + 20 < inputScreen.offsetWidth;
}

/**
 * Add to Input Values Array Function
 * 
 * Update the current digit in input
 * @param {string} value digit to update
 */
function addToInputValues(value) {
    if (inputValues.length == 0) 
        inputValues[0] = value;
    else
        inputValues[inputValues.length - 1] += value;
}

/**
 * Update Input Display Function
 * 
 * Updates Input display (if possible) with value provided
 * @param {string} value string representing value
 * @param {boolean} buttonPress from buttonPressListener
 * @param {boolean} isOperator value is an operator
 */
function updateInput(value, isOperator=false, buttonPress=true) {
    // After pressing equals, clear input for user
    if (resetResult) {
        result.textContent = "";
        resetResult = false;
    }

    // Add Operation
    if (isOperator) {
        const operatorRepr = STRING_OPERATORS[buttonPress ? VALID_OPERATORS.indexOf(value) : KEY_OPERATORS.indexOf(value)];
        inputValues[inputValues.length] = operatorRepr;
        inputValues[inputValues.length] = "";
        operation = generateOperations(inputValues);
    } 
    
    // Otherwise add number
    else {
        if (buttonPress) {
            if (value == "decimal-point") 
                addToInputValues(".");
            else if (value == "pi") 
                addToInputValues(String.fromCharCode(960));
            else 
                addToInputValues(value.replace("digit-", ""));

            operation = generateOperations(inputValues);
        } else {}
    }

    let inputString = "";
    inputValues.forEach(val => {inputString += val});
    input.textContent = inputString;
    document.querySelector(".calculator").click();
}

/**
 * Update Result Function 
 * 
 * Updates the result screen by evaluating input in display
 */
function updateResult() {
    let err = false;
    if ("error" in operation) {
        result.textContent = operation.error;
        err = true;
    } else {
        let solution = evaluate(operation);
        result.textContent = clip(solution.answer);
    }

    if (!err) {
        inputValues = []
        operation = generateOperations(inputValues);
        resetResult = true;
    }
}

/**
 * Backspace Function
 * 
 * Removes the last value (or from specified index) on input screen
 * @param {number} index remove character from this index 
 */
function backspace(index=0) {
    // Only trim when there are values in Input Screen
    if (inputValues.length > 0) {
        let digits = inputValues[inputValues.length - 1 - index];

        // Identify Function Values
        if (digits.length == 0) {
            inputValues.pop(); // pop empty string
            digits = inputValues[inputValues.length - 1 - index]; // update digits value
            if (STRING_OPERATORS.includes(digits)) 
                inputValues.pop(); // pop function string
        } 
        
        // Trim as normal
        else {
            digits = digits.substring(0, digits.length - 1 - index);
            inputValues[inputValues.length - 1] = digits;

            // Pop if first value and if string has no length
            if (digits.length == 0 && inputValues.length == 1) inputValues.pop();
        }
    }
    
    operation = generateOperations(inputValues);
    let inputString = "";
    inputValues.forEach(val => {inputString += val});
    input.textContent = inputString;
}

/**
 * Clear Function
 * 
 * Clears the Input and the Results Screens
 */
function clear() {
    inputValues = [];
    operation = generateOperations([]);
    input.textContent = "";
    result.textContent = "";
}

/**
 * Button Click Event Listener
 * 
 * Update Input or Result Display depending on Buttons pressed
 * @param {object} event click event
 */
function buttonPressListener(event) {
    if (canAdd()){
        if (event.target.id.includes("digit-") || event.target.id == "decimal-point" || event.target.id == "pi") updateInput(event.target.id);

        if (VALID_OPERATORS.includes(event.target.id.toLowerCase())) updateInput(event.target.id.toLowerCase(), true);
    }

    if (event.target.id == "equals") updateResult();

    if (event.target.id == "delete") backspace();

    if (event.target.id == "clear") clear();
}

function keyPressListerner(event) {
    if (canAdd()) {
        if (!isNaN(event.key) || event.key == "." || event.key == "p")
            updateInput(event.key == "p" ? "pi" : event.key);

        if (KEY_OPERATORS.includes(event.key))
            updateInput(event.key, true, false);
    }

    if (event.key.toLowerCase() == "=") updateResult();

    if (event.key.toLowerCase() == "backspace") backspace();

    if (event.key.toLowerCase() == "a" || event.key.toLowerCase() == "c") clear();
}