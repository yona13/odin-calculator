# odin-calculator
Odin Foundations Project 5 - Calculator

## Iteration 1 - UI Complete
- A lot of the functionality is there, however I'm considering changing some of it.

## Iteraton 2 - Operation Handling
 - Improvement on how operations are handled
 - Operations are considered as scaled lists of real numbers that should be summed together
 - i.e. -9.2 * 7 - 6 / 2 + 1 + 1
    ==  {
            -9.2: [7],
            -6: [1/2],
            1: [1, 1]
        }
 - Operation is represented as a JavaScript object, and parsed through to get solution
 - In above example, -9.2 is identified as a scalar because of the multiplication symbol. Any time -9.2 is seen again, any values scaled to -9.2 will subsequently be added to it's list, such as with 7
 - -6 is also identified as a scalar, it's list contents are 1/2
 - 1 is scaling 2 objects, because 1 is added twice to the list
 - Parsing will iterate through the keys of the object, and sum the values in it's list, then scale it by the key. This result is added to the overall result, and the return value is shown on the calculator display

 ### Bug
  - When a value is typed out with the button display, i.e. mouse clicks on the number buttons, and the result is "evaluated" using the enter button, i.e. keypress with enter, the display will not update with the answer, but the solution can be displayed on the console