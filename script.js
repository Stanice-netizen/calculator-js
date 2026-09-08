const display = document.getElementById('display')

let currentNumber = ''
let previousNumber = ''
let operator = ''
let expression = ''
let shouldResetDisplay = false

// Perform a calculation
function performCalculation (firstNumber, secondNumber, selectedOperator) {
  if (selectedOperator === '+') {
    return firstNumber + secondNumber
  }

  if (selectedOperator === '-') {
    return firstNumber - secondNumber
  }

  if (selectedOperator === '*') {
    return firstNumber * secondNumber
  }

  if (selectedOperator === '/') {
    if (secondNumber === 0) {
      return null
    }

    return firstNumber / secondNumber
  }
}

// Add numbers and operators
function appendValue (value) {
  // If the calculator has just displayed a result
  if (shouldResetDisplay) {
    if (value === '+' || value === '-' || value === '*' || value === '/') {
      previousNumber = currentNumber
      expression = currentNumber + ' ' + value + ' '
      display.value = expression

      operator = value
      currentNumber = ''
      shouldResetDisplay = false

      return
    }

    // Pressing a number after the result starts a new calculation
    currentNumber = ''
    previousNumber = ''
    operator = ''
    expression = ''
    shouldResetDisplay = false
  }

  // Operators
  if (value === '+' || value === '-' || value === '*' || value === '/') {
    // Don't allow an operator before a number
    if (currentNumber === '' && previousNumber === '') {
      return
    }

    // Don't allow two operators in a row
    if (operator !== '' && currentNumber === '') {
      return
    }

    // Resolve the pending operation before using the new operator
    if (previousNumber !== '' && operator !== '' && currentNumber !== '') {
      const result = performCalculation(
        Number(previousNumber),
        Number(currentNumber),
        operator
      )

      if (result === null) {
        display.value = 'Error'

        currentNumber = ''
        previousNumber = ''
        operator = ''
        expression = ''

        return
      }

      const roundedResult = Number(result.toFixed(10))

      previousNumber = String(roundedResult)
      currentNumber = ''
    } else {
      previousNumber = currentNumber
      currentNumber = ''
    }

    operator = value

    expression += ' ' + value + ' '

    display.value = expression

    return
  }

  // Percentage
  if (value === '%') {
    if (currentNumber === '') {
      return
    }

    currentNumber = String(Number(currentNumber) / 100)

    // Replace the current number in the expression
    const parts = expression.split(' ')

    parts[parts.length - 1] = currentNumber

    expression = parts.join(' ')

    display.value = expression

    return
  }

  // Decimal
  if (value === '.') {
    if (currentNumber.includes('.')) {
      return
    }

    if (currentNumber === '') {
      currentNumber = '0.'
    } else {
      currentNumber += '.'
    }

    expression += value

    display.value = expression

    return
  }

  // Number
  currentNumber += value

  expression += value

  display.value = expression
}

// Clear calculator
function clearDisplay () {
  currentNumber = ''
  previousNumber = ''
  operator = ''
  expression = ''
  shouldResetDisplay = false

  display.value = ''
}

// Change sign
function changeSign () {
  if (currentNumber === '') {
    return
  }

  if (currentNumber.startsWith('-')) {
    currentNumber = currentNumber.slice(1)
  } else {
    currentNumber = '-' + currentNumber
  }

  // Replace the last number in the expression
  const parts = expression.split(' ')

  parts[parts.length - 1] = currentNumber

  expression = parts.join(' ')

  display.value = expression
}

// Calculate
function calculate () {
  if (previousNumber === '' || currentNumber === '' || operator === '') {
    return
  }

  const result = performCalculation(
    Number(previousNumber),
    Number(currentNumber),
    operator
  )

  if (result === null) {
    display.value = 'Error'

    currentNumber = ''
    previousNumber = ''
    operator = ''
    expression = ''

    return
  }

  const roundedResult = Number(result.toFixed(10))

  // Show only the answer after =
  display.value = roundedResult

  currentNumber = String(roundedResult)
  previousNumber = ''
  operator = ''
  expression = String(roundedResult)

  shouldResetDisplay = true
}

// Make functions available to HTML onclick attributes
window.appendValue = appendValue
window.clearDisplay = clearDisplay
window.changeSign = changeSign
window.calculate = calculate