// Variables to store the full expression and display reset flag
let expression = ""; // Store the expression
let shouldResetDisplay = false; // Flag to reset the display

// Event listener for button clicks
document.getElementById("calculatorContainer").addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        handleInput(event.target.textContent);
    }
});

// Event listener for keyboard input
document.addEventListener("keydown", function (event) {
    const key = event.key;
    const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/", "Enter", "Backspace", "Delete", "(", ")"];

    if (validKeys.includes(key)) {
        if (key === "Enter") {
            handleInput("=");
        } else if (key === "Backspace" || key === "Delete") {
            handleInput("Del");
        } else {
            handleInput(key);
        }
    }
});

// Function to handle input (both button clicks and keyboard)
function handleInput(value) {
    let display = document.getElementById("inputField");

    if (value === "Clear") {
        clearDisplay(display);
    } else if (display.value !== "Error") {
        if (value === "Del") {
            deleteLastEntry(display);
        } else {
            handleButtonClick(value, display);
        }
    }
}

// Function to clear the display
function clearDisplay(display) {
    display.value = "0";
    expression = "";
    shouldResetDisplay = false;
}

// Function to handle button clicks
function handleButtonClick(value, display) {
    if (isNumber(value) || value === ".") {
        handleNumberClick(value, display);
    } else if (isOperator(value)) {
        handleOperatorClick(value, display);
    } else if (value === "=") {
        handleEqualsClick(display);
    }
    updateExpression(value, display);
}

// Function to handle number button clicks
function handleNumberClick(value, display) {
    if (shouldResetDisplay) {
        display.value = value;
        shouldResetDisplay = false;
    } else {
        display.value += value;
    }
}

// Function to handle operator button clicks
function handleOperatorClick(value, display) {
    if (shouldResetDisplay) {
        display.value = value;
        shouldResetDisplay = false;
    } else {
        display.value += value;
    }
}

// Custom function to evaluate mathematical expression
function evaluateExpression(expression) {
    if (containsMultipleDecimals(expression) || hasInvalidDecimalPlacement(expression)) {
        throw new Error("Invalid expression");
    }

    try {
        let tokens = tokenizeExpression(expression);
        let postfix = infixToPostfix(tokens);
        return evaluatePostfix(postfix);
    } catch (error) {
        return error.message;
    }
}

// Function to tokenize the expression
function tokenizeExpression(expression) {
    expression = expression.replace(/(\d+)\(/g, "$1*(");
    expression = expression.replace(/\)(\d+)/g, ")*$1");
    expression = expression.replace(/(\d+)([a-zA-Z])/g, "$1*$2");

    let tokens = expression.match(/(\d+\.?\d*|\.\d+|[+\-*/()])/g);
    if (!tokens) throw new Error("Invalid expression");
    return tokens;
}

// Function to convert infix to postfix using the Shunting Yard algorithm
function infixToPostfix(tokens) {
    let outputQueue = [];
    let operatorStack = [];

    const precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };

    const associativity = {
        "+": "L",
        "-": "L",
        "*": "L",
        "/": "L"
    };

    tokens.forEach(token => {
        if (isNumber(token)) {
            outputQueue.push(parseFloat(token));
        } else if (isOperator(token)) {
            while (
                operatorStack.length &&
                isOperator(operatorStack[operatorStack.length - 1]) &&
                ((associativity[token] === "L" && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) ||
                    (associativity[token] === "R" && precedence[token] < precedence[operatorStack[operatorStack.length - 1]]))
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    });

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

// Function to evaluate the postfix expression
function evaluatePostfix(postfix) {
    let resultStack = [];

    postfix.forEach(token => {
        if (isNumber(token)) {
            resultStack.push(token);
        } else if (isOperator(token)) {
            let b = resultStack.pop();
            let a = resultStack.pop();
            let result;
            switch (token) {
                case "+":
                    result = a + b;
                    break;
                case "-":
                    result = a - b;
                    break;
                case "*":
                    result = a * b;
                    break;
                case "/":
                    if (b === 0) {
                        throw new Error("you funny? Cannot divide by zero.");
                    }
                    result = a / b;
                    break;
            }
            resultStack.push(result);
        }
    });

    return resultStack[0];
}

// Function to handle equals button click
function handleEqualsClick(display) {
    try {
        let result = evaluateExpression(expression);
        if (result === "you funny? Cannot divide by zero.") {
            display.value = result;
            expression = "";
        } else if (!isNaN(result)) {
            display.value = result;
            expression = result.toString();
            shouldResetDisplay = true;
        } else {
            display.value = "Error";
            expression = "";
        }
    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

// Function to delete the last character
function deleteLastEntry(display) {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        display.value = expression || "0";
    }
}

// Function to check if the argument is an operator
function isOperator(value) {
    return ["+", "-", "*", "/"].includes(value);
}

// Function to check if the argument is a number
function isNumber(value) {
    return !isNaN(value);
}

// Function to check if a value contains multiple decimals
function containsMultipleDecimals(value) {
    const parts = value.split(/[\+\-\*\/]/);
    return parts.some(part => (part.split(".").length - 1) > 1);
}

// Function to check for invalid decimal placement
function hasInvalidDecimalPlacement(value) {
    return value.split(/[\+\-\*\/]/).some(part => part.startsWith(".") || part.endsWith("."));
}

// Function to update the expression display
function updateExpression(value, display) {
    if (value === "=" || value === "Clear" || value === "Del") {
        return;
    } else if (shouldResetDisplay && isNumber(value)) {
        expression = value;
        shouldResetDisplay = false;
    } else {
        expression += value;
    }
    display.value = expression;
}

// Initial setup for the display
document.addEventListener("DOMContentLoaded", function () {
    let displayField = document.getElementById("inputField");
    displayField.value = "0";
});
