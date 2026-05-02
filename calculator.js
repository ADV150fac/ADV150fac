let display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        display.value = number;
        shouldResetDisplay = false;
    } else {
        display.value += number;
    }
    currentInput = display.value;
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    
    if (currentInput !== '') {
        if (previousInput !== '' && operator) {
            calculate();
        }
        previousInput = currentInput;
        currentInput = '';
    }
    
    operator = op;
    shouldResetDisplay = true;
}

function appendDecimal() {
    if (shouldResetDisplay) {
        display.value = '0.';
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (currentInput.indexOf('.') === -1) {
        if (currentInput === '') {
            display.value = '0.';
            currentInput = '0.';
        } else {
            display.value += '.';
            currentInput += '.';
        }
    }
}

function calculate() {
    if (operator === null || currentInput === '' || previousInput === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error';
                currentInput = '';
                previousInput = '';
                operator = null;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Fix floating point precision
    result = Math.round(result * 100000000) / 100000000;
    
    display.value = result;
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
}

function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    display.value = currentInput;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        e.preventDefault();
        appendDecimal();
    } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        appendOperator(e.key);
    } else if (e.key === '*') {
        e.preventDefault();
        appendOperator('*');
    } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});
