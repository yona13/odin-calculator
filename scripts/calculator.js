/* -- Variables -- */
const VALID_OPERATORS = ["add", "subtract", "multiply", "divide"];
const KEY_OPERATORS = ["+", "-", "*", "/"];
const FUNCTIONAL_OPERATORS = [add, subtract, multiply, divide];
const STRING_OPERATORS = ["+", "-", String.fromCharCode(215), String.fromCharCode(247)];
const ERROR = {SYNTAX: "Syntax Error", MATHS: "Maths Error"};
const MAXIMUM_DIGITS = 14;

/* -- Functions -- */

/**
 * Add Function 
 * 
 * Returns the addition of the numbers a and b
 * @param {number} a any real number (base 10)
 * @param {number} b any real number (base 10)
 * @returns a + b
 */
function add(a, b) {
    return a + b;
}

/**
 * Subtract Function 
 * 
 * Returns the difference between the numbers a and b
 * @param {number} a any real number (base 10)
 * @param {number} b any real number (base 10)
 * @returns a - b
 */
function subtract(a, b) {
    return a - b;
}

/**
 * Multiply Function 
 * 
 * Returns the product of the numbers a and b
 * @param {number} a any real number (base 10)
 * @param {number} b any real number (base 10)
 * @returns a * b
 */
function multiply(a, b) {
    return a * b;
}

/**
 * Divide Function 
 * 
 * Returns the quotient of the numbers a and b
 * @param {number} a any real number (base 10)
 * @param {number} b any real number (base 10)
 * @returns a/b, if b == 0 Maths Error
 */
function divide(a, b) {
    if (b == 0) return ERROR.MATHS;
    else return a / b;
}

/**
 * Pi Function
 * 
 * Returns a Scaled Value of Pi
 * @param {number} scale amount to scale pi by (default 1)
 * @returns scale * pi
 */
function pi(scale=1) {
    return scale * Math.PI;
}

/**
 * Clip Function
 * 
 * Clips value so that it fits on results screen
 * @param {number} value value to round 
 * @returns value (but shorter if needed)
 */
function clip(value) {
    if (value == 0) return 0;
    const minusMargin = value < 0 ? 1 : 0;
    const magnitude = MAXIMUM_DIGITS - minusMargin - Math.floor(Math.log10(Math.abs(value)));
    return Math.round(value * (10 ** magnitude)) / (10 ** magnitude);
}

/**
 * Operate Function
 * 
 * Returns the result of the given operator between 
 * the numbers a and b
 * @param {function} operator any of the functions above
 * @param {number} a any real number (base 10)
 * @param {number} b any real number (base 10)
 * @returns result of operation or Maths Error
 */
function operate(operator, a, b) {
    if (a == ERROR.MATHS || b == ERROR.MATHS) return ERROR.MATHS;

    if (operator == add || operator == subtract 
        || operator == multiply || operator == divide)
        return operator(a, b);
    else
        return ERROR.MATHS;
}

/**
 * Parse Number Function 
 * 
 * Returns the real number represented in the string, 
 * or a Syntax Error, if there are too many decimals
 * @param {string} n string representation of number 
 * @returns number represented by n or Syntax Error
 */
function parseNumber(n, secondValue=false) {
    let currentValue = "";
    let negative = false;
    let decimalDetected = false;
    let limitReached = false;

    // Iterate through string
    for (var i = 0; i < n.length; i++) {
        if (n.charCodeAt(i) == 960) {
            if (decimalDetected) return ERROR.SYNTAX;
            else if (currentValue.length == 0) currentValue = pi();
            else if (!isNaN(currentValue)) currentValue = pi(currentValue);
            else return ERROR.SYNTAX;
            limitReached = true;
        }
        
        if (!isNaN(n[i])) {
            if (!limitReached) currentValue += n[i];
            else return ERROR.SYNTAX;
            decimalDetected = false;
        }
        
        if (n[i] == ".") {
            if (decimalDetected) // Throw Syntax Error
                return ERROR.SYNTAX;
            if (!limitReached) {
                currentValue += ".";
                decimalDetected = true;
            } else return ERROR.SYNTAX
        }

        if (n[i] == "-" && i == 0) 
            negative = true;
    }

    if (currentValue == "." && !secondValue) return 0;
    else if (currentValue == "." && secondValue) return ERROR.SYNTAX;
    else if (currentValue.length == 0 && secondValue) return ERROR.SYNTAX;
    if (negative) return -1 * parseFloat(currentValue);
    return parseFloat(currentValue);
}

/**
 * Has Pi Function
 * 
 * Returns true if value includes pi
 * @param {string} value string representation of number 
 * @returns true if pi is in string, false otherwise
 */
function hasPi(value) {
    for (var p = 0; p < value.length; p++) {
        if (value.charCodeAt(p) == 960) return true;
    }

    return false;
}

/**
 * Generate Operations Function
 * 
 * Returns an object of operations based on input values
 * @param {Array} inputs values and operators selected by user
 * @returns object of operations, or object of error
 */
function generateOperations(inputs) {
    // Initialise Variables
    let operations = {};
    let toggler = {positive: false, negative: false};
    let currentValue = 0;
    let currentKey = false;
    let divisor = false;

    // Iterate through values and operators
    for (var i = 0; i < inputs.length; i++) {
        // Toggle Positvie and Negative if + or minus appears
        if (inputs[i] == "+" || inputs[i] == "-") {
            toggler[inputs[i] == "+" ? "positive" : "negative"] = inputs[i] == "+" ? true : !toggler.negative;
            if (currentKey) {
                operations[currentValue].push(1);
                currentKey = false;
            }
            continue;
        }

        // Throw error if * or / appears after string of +s or -s
        if ((toggler.positive || toggler.negative) && STRING_OPERATORS.includes(inputs[i]))
            return {error: ERROR.SYNTAX};

        // Handle Numbers
        if ((!isNaN(inputs[i]) || hasPi(inputs[i])) && inputs[i].length > 0) {
            let value = parseNumber(inputs[i]);
            if (value == ERROR.SYNTAX) return {error: ERROR.SYNTAX};
            if (toggler.negative) value *= -1;
            toggler.negative = false;
            toggler.positive = false;

            // If Current Value is set, Search for current
            // value in operation keys, else search for value
            let inOperations = false;
            Object.keys(operations).forEach(k => {
                if (k == (currentKey ? currentValue : value)) 
                    inOperations = true;
            });

            // Add empty* array to key if not in operations
            if (!inOperations) {
                operations[value] = [];

                // *if last value in inputs, add [1];
                if (i == inputs.length - 1)
                    operations[value] = [1];

                // Set Current Value
                currentValue = value;
                currentKey = true;
                continue;
            } 
            
            // Add value to be multipled/divided by current
            // value to it's array in the operations
            else { 
                // For Divisors, check for maths error (i.e. a/0)
                if (divisor) {
                    if (divide(1, value) == ERROR.MATHS) 
                        return {error: ERROR.MATHS};
                    else 
                        operations[currentValue] = [divide(1, value)];
                } 
                
                // For Multipliers, just add value to array
                else 
                    operations[currentValue] = [value];
                    
                // Reset current values
                currentKey = false;
                divisor = false;
                continue;
            }
        }

        // Handle * or / operators
        if (STRING_OPERATORS.includes(inputs[i])) {
            if (i == 0) return {error: ERROR.SYNTAX};
            currentKey = true;
            divisor = STRING_OPERATORS.indexOf(inputs[i]) == 3;
        } 
        
        // Return Syntax Error otherwise
        else if (isNaN(inputs[i])) return {error: ERROR.SYNTAX};
    }

    return operations;
}

/**
 * Evaluate Function
 * 
 * Evalautes the operations proposed by the user
 * @param {object} operations object of operations in input
 * @returns result of operations
 */
function evaluate(operations) {
    // Return 0 for empty input
    if (operations.length == 0) return {answer: 0};

    // Otherwise sum through all keys
    let sum = 0;
    Object.keys(operations).forEach(key => {
        let keySum = 0;
        // For each key, multiply by it's values and sum those
        operations[key].forEach(value => {keySum += value});
        sum += multiply(key, keySum);
    });

    return {answer: sum};
}