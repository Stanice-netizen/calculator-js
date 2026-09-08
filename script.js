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

  return null
}

// Format calculation result
function formatResult (result) {
  return Number(result.toFixed(10))
}

// Reset calculator after an error
function resetAfterError () {
  currentNumber = ''
  previousNumber = ''
  operator = ''
  expression = ''
}

// Add numbers and operators
function appendValue (value) {
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

    currentNumber = ''
    previousNumber = ''
    operator = ''
    expression = ''
    shouldResetDisplay = false
  }

  if (value === '+' || value === '-' || value === '*' || value === '/') {
    if (currentNumber === '' && previousNumber === '') {
      return
    }

    if (operator !== '' && currentNumber === '') {
      return
    }

    if (previousNumber !== '' && operator !== '' && currentNumber !== '') {
      const result = performCalculation(
        Number(previousNumber),
        Number(currentNumber),
        operator
      )

      if (result === null) {
        display.value = 'Error'
        resetAfterError()
        return
      }

      previousNumber = String(formatResult(result))
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

  if (value === '%') {
    if (currentNumber === '') {
      return
    }

    currentNumber = String(Number(currentNumber) / 100)

    const parts = expression.split(' ')
    parts[parts.length - 1] = currentNumber
    expression = parts.join(' ')

    display.value = expression
    return
  }

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
    resetAfterError()
    return
  }

  const roundedResult = formatResult(result)

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
