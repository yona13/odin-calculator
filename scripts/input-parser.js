/** Input Parser Script for the Calculator Project */

/* Functions */

/* Is Function Key Function */
function isFunctionKey(value, isString=false) {
    if (!isString) return FUNCTION_KEYS.includes(value);
    else return FUNCTION_STRS.includes(value);
}

/* Legal After Pi Function */
function legalAfterPi(value) {
    return !(!isNaN(value) || value == "." || value.charCodeAt(0) == 960);
}

/* Build Operations Function */
function generateOperations(input, answer) {
    let currentValue = "";
    let currentKey = 0;
    let first = true;
    let decimalDetected = false;
    let negative = false;
    let divide = false;
    let isPi = false;
    let isAns = false;
    let isCurrentAns = false;
    let lower = "";
    let piCurrent = 0;
    let operation = {};
    
    // Parse Input String
    for (var i = 0; i < input.length; i++) {
        console.log(input[i])
        lower = input[i].toLowerCase();
        if (lower == "a" || lower == "n" || lower == "s") {
            isAns = true;
            console.log(`currentvalue (${currentValue}) == "" CHECK: ${currentValue == ""}`)
            if (currentValue == "" && lower == "s") currentValue = answer;
            else if (currentValue != "" && lower == "s") {
                console.log(`Current Value: ${currentValue}`)
                answer = parseFloat(currentValue) * answer;
                isCurrentAns = true;
                currentValue = answer;
            }
        }

        if (!isNaN(input[i]) && isPi) {
            operation.error = "SYNTAX ERROR";
            break;
        }

        // Add to Current Value if Character is Numeric
        if (!isNaN(input[i])) currentValue += input[i];

        // Add a Decimal Point
        else if (input[i] == ".") {
            if (decimalDetected) {
                // If Decimal already detected, throw Syntax Error
                operation.error = "SYNTAX ERROR";
                break;
            } else currentValue += ".";
            decimalDetected = true;
        } 
        
        // Handle Operation
        else {
            // Handle Special Initial Value Cases
            if (currentValue == "" && input[i] == "-") {
                // Only case: first input is negative
                negative = true; // toggle and continue
                continue;
            } else if (currentValue == "" && input.charCodeAt(i) != 960 && !isPi && input[i] != "|" && !isAns) {  
                // Can only be empty string, or Syntax error thrown
                if (input[i] != "|") operation.error = "SYNTAX ERROR";
                break;
            }

            if (isAns && !isCurrentAns) continue;

            let value = 0
            if (isPi) value = piCurrent;
            else if (isCurrentAns) value = answer;
            else if (isPi && isCurrentAns) value = multiply([piCurrent, answer]);
            else value = parseFloat(currentValue); // Number from String
            if (isNaN(value)) value = 0;
            console.log(`Value: ${value}; Character: ${input[i]}`)

            if (input.charCodeAt(i) == 960) {
                if (currentValue == "") value = Math.PI;
                else value *=Math.PI;
                // Check next digit is legal
                if (!legalAfterPi(input[i + 1])) {
                    operation.error = "SYNTAX ERROR";
                    break;
                }
                piCurrent = value;
                isPi = true;
                console.log(value);
            }

            if (divide) {
                if (value == 0) { 
                    // cannot divide by 0, throw Maths Error
                    operation.error = "MATHS ERROR";
                    break;
                } else {
                    // Otherwise take reciprocal
                    value = 1 / value;
                }
            }
            if (negative) value *= -1;

            // Add Key to Object
            if (input[i] == "+" || input[i] == "-" || input[i] == "|") {
                if (first) operation[value] = [1];
                else operation[currentKey].push(value);
                first = true;
                isPi = false;
                isAns = false;
                isCurrentAns = false;
            }

            // Add Value to Object
            else if (input.charCodeAt(i) == 215 || input.charCodeAt(i) == 247) {
                if (first) {
                    if (!(value in operation)) operation[value] = [];
                    first = false;
                } else {
                    operation[currentKey].push(value);
                }
                currentKey = value;
                isPi = false;
                isAns = false;
                isCurrentAns = false;
            }
                
            // Reset Variables
            decimalDetected = false;
            negative = input[i] == "-";
            divide = input.charCodeAt(i) == 247;
            currentValue = "";
        }
    }
    console.log(operation);

    return operation;
}

/* Parse Generated Operations Function */
function parseOperations(operation) {
    if ("error" in operation) return operation.error;
    let result = 0;

    // For Each Operation, add to the Result the Result of the Operation
    for (key in operation) result += multiply([key, sum(operation[key])]);
    return result;
}

/* Evaluate Function */
function evaluate(input, answer) {
    return parseOperations(generateOperations(input, answer));
}

/* Variables */
const FUNCTION_KEYS = ["+", "-", "*", "/"];
const FUNCTION_STRS = ["add", "minus", "multiply", "divide"];