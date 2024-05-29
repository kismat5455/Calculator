
//variables to store the values and operators
let variableOne = null;
let variableTwo = null;
let operator = null;
let count = 1;
//a function that returns the number that is clicked on the calculator
let buttonClicked = document.getElementById("calculatorContainer");
buttonClicked.addEventListener("click", function (event) {

    if (event.target.tagName === "BUTTON") {

        value = event.target.textContent;





        let display = document.getElementById("inputField");


        //if the user  clicks on the clear button, the display value is set to 0 and the variables are set to null  


        if (value === "Clear") {
            display.value = "0";
            clearDisplay();
        } else if (display.value !== "Error") {

            if (isVariableOneSet(variableOne) && isNumber(value)) {
                setDisplayValue(display, value);
            } else if (isOperatorSet(operator)) {
                if (isVariableOneSet(variableOne)) {
                    setVariableOne(display, convertToNumber(display.value));
                }
                setDisplayValue(display, value);
                setOperatorValue(value);
            } else if (value !== "=" && !isNumber(value) && isOperator(value)) {
                setDisplayValue(display, value);
            } else if (value !== "=" && isNumber(value)) {
                if (count === 1) {
                    display.value = "";
                    count++;
                }
                setDisplayValue(display, value);
            }
            else {


                variableTwo = convertToNumber(display.value);

                if (operationPossible(variableOne, variableTwo, operator)) {
                    calculate(display, variableOne, variableTwo, operator);
                } else {
                    display.value = "Error";
                }


            }
        }


    }

});



//a function that clears the display and sets the variables to null
function clearDisplay(){

    variableOne = null;
    variableTwo = null;
    operator = null;
    count = 1;
}

//function that check if we are allowed to set  variable1
function isVariableOneSet(variableOne) {
    return variableOne === null;
}


//function that checks if the first display value is zero and replaces it with the value clicked
function isDisplayValueZero(display) {
    return display.value === "0";
}

//function that sets the display value to the value clicked
function setDisplayValue(display, value) {

    if (isDisplayValueZero(display) || (isOperator(value) && isOperatorSet(operator))) {
        display.value = value;
        // operator = "2222";//this is a dummy value to prevent the operator from being set and resulying in error
    } else {
        display.value += value;
    }
}


//function that checks if we are allowed to set the operator
function isOperatorSet(operator) {
    return operator === null;
}

//function that sets the first variable to the value clicked
function setVariableOne(display, value) {
    variableOne = value;
}

//function that sets the operator to the value clicked
function setOperatorValue(value) {
    operator = value;
}



//function that checks if the operation is possible
function operationPossible(variableOne, variableTwo, operator) {
    return (variableOne != null && isNumber(variableOne) && variableTwo != null && isNumber(variableTwo) && operator != null && isOperator(operator))
}


//a function that checks if the button clicked is a number or an operator given a string
function isNumber(value) {
    return !isNaN(parseInt(value));
}

//a function that calculates the result of the operation
function calculate(display, value1, value2, operation) {
    let result = null;
    switch (operation) {
        case "+":
            result = value1 + value2;
            break;
        case "-":
            result = value1 - value2;
            break;
        case "*":
            result = value1 * value2;
            break;
        case "/":
            result = value1 / value2;
            break;
    }
    display.value = result;
    variableOne = result;
    variableTwo = null;
    operator = null;
    count = 1;
}


//a function that checks if the argument is an operator
function isOperator(value) {
    return value === "+" || value === "-" || value === "*" || value === "/";
}

// a function that converts string to number
function convertToNumber(value) {
    return parseFloat(value);
}






