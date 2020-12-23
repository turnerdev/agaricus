import { mean, standardDeviation, zScore } from './statistics.js'

const HEADER_ROW_ZSCORE = -2

/**
 * Determine how many header rows an array of records is likely to have.
 * Since a header row is less likely to contain numeric characters compared to a
 * transaction, count the numbers for a given row and calculate the Z-score.
 * Any consecutive rows with a Z-score > 2 from element 0 are assumed to be headers.
 * @param {*} data 
 */
export function hasHeaderRows(data) {
  const digitFrequency = data.map(row => (row.match(/\d/g) || []).length)
  const stdDev = standardDeviation(digitFrequency)
  const m = mean(digitFrequency)
  const zScores = digitFrequency.map(n => zScore(n, m, stdDev))
  let hrows = 0
  while (zScores[hrows] < HEADER_ROW_ZSCORE && hrows < zScores.length) { hrows++ }
  return hrows
}

const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
]

const dateFormats = {
  year: '(19|20)?[0-9]{2}',
  day: '[0-3]?[0-9]',
  month: '1[0-2]|0?[1-9]'
}

const buildDatePattern = (components) => RegExp('^'+components.map(comp =>
  `(?<${comp}>${dateFormats[comp]})`).join('[\\-/]')+'$', 'i')

const patterns = [
  ['year', 'month', 'day'],
  ['year', 'day', 'month'],
  ['month', 'day', 'year'],
  ['day', 'month', 'year']
].map(buildDatePattern)

// export function predictFormat(dates) {
//   const samples = [].concat(dates)
//   let i = 0
//   let matches = [...patterns]
//   while (i < samples.length && matches.length > 1) {
//     matches = matches.filter(re => re.exec(samples[i]))
//     i++
//   }
//   return matches
// }

function makeGenerator(input) {
  function* mkGenerator(elements) {
    for (let element of elements) {
      yield element
    }
  }
  if (typeof input.next === 'function') {
    return input
  } else if (input instanceof Array) {
    return mkGenerator(input)
  } 
  return mkGenerator([input])
}


const amountPatterns = {
  positive: RegExp('^[\\$£€¥]?(?<value>\\d+\\.\\d+)$'),
  negative: RegExp('^[\\$£€¥]?(?<value>-\\d+\\.\\d+)$'),
  accounting: RegExp('^\\([\$£€¥]?(?<value>\\d+\\.\\d+)\\)$')
}
const patternNames = Object.keys(amountPatterns)

export function parseAmount(value) {
  const positive = amountPatterns.positive.exec(value)
  const negative = amountPatterns.negative.exec(value)
  const accounting = amountPatterns.accounting.exec(value)
  if (positive) return Number(positive.groups.value)
  if (negative) return Number(negative.groups.value)
  if (accounting) return -Number(accounting.groups.value)
  return 0
}

export function predictAmountFormat(values) {
  let generator = makeGenerator(values)
  let it = generator.next()

  const count = patternNames.reduce((a, c) => ({...a, [c]: 0}), {})
  let noMatch = false
  let startlogs = false
  while (!noMatch && !it.done) {
    if (!it.value) {
      it = generator.next()
      continue
    }
    let i = 0
    let found = false
    while (!found && i < patternNames.length) {
      const doesMatch = amountPatterns[patternNames[i]].exec(it.value)
      console.log('MATCH CHECK')
      console.log(amountPatterns[patternNames[i]])
      console.log(it.value)
      console.log(doesMatch)
      if (doesMatch) {
        count[patternNames[i]]++
        found = true
      }
      i++
    }
    if (i === patternNames.length && !found) {
      noMatch = true
    }
    it = generator.next()
  }
  return count
}


function getDatePatternMatches(dateStr, patternSet) {
  return (patternSet || patterns).filter(re => re.exec(dateStr))
}

/**
 * Predict the format of a date based on input
 * @param {*} dates - singular date, array or generator function
 */
export function predictDateFormat(dates) {
  let generator = makeGenerator(dates)
  let matches = [...patterns]
  let it = generator.next()
  while (matches.length > 1 && !it.done) {
    matches = getDatePatternMatches(it.value, matches)
    // console.log(it.value)
    // console.log(matches)
    it = generator.next()
  }
  return matches
}

export function parseDate(dateStr, format) {
  let fmt
  if (format === undefined) {
    const predictions = predictDateFormat(dateStr)
    if (predictions.length === 1) {
      fmt = predictions[0]
    } else {
      throw `Ambiguous date format ${dateStr}`
    }
  } else {
    fmt = format
  }

  // console.log(dateStr)
  let {year, month, day} =  fmt.exec(dateStr).groups
  return new Date(year, month-1, day)
}
