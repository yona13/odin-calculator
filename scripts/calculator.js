const add = function(a, b) {
    return a + b;
};
  
const subtract = function(a, b) {
    return a - b;
};
  
const multiply = function(array) {
    let result = 1;
    for (const item of array)
      result *= item;
    
    return result;
};
  
const power = function(a, b) {
    return a ** b;
};
  
const factorial = function(a) {
    if (a == 0 || a == 1)
        return 1;
    let result = 1;
    for (var i = 1; i <= a; i++) 
        result *= i;
    return result;
};