import { predictDateFormat, predictAmountFormat, parseDate } from '../src/utils/heuristics'

describe('Test currency parsing heuristics', () => {

  it('Example', async () => {
    const values = ['($23.23)', '-12.00', '(1.23)', '($42.34)', '34.12', '$23.23']
    const result = predictAmountFormat(values)
    expect(result.accounting).toBe(3)
    expect(result.positive).toBe(2)
    expect(result.negative).toBe(1)
  })

})

describe('Test data parsing heuristics', () => {

  it('Ambiguous format', async () => {
    const samples = [ '01/10/2020' ]
    expect(predictDateFormat(samples).length).toBeGreaterThan(1)
  })

  it('Test contextual heuristics', async () => {
    const samples = [ '01/10/2020', '24/02/2020' ]
    expect(predictDateFormat(samples).length).toBe(1)
  })

})

test('Test unambiguous date parsing', async () => {
  const sampleDateText = '31 Jan 1970 00:00:00'
  const sampleDate = new Date(sampleDateText)

  expect(parseDate('31/01/1970')).toStrictEqual(sampleDate)
  expect(parseDate('01-31-1970')).toStrictEqual(sampleDate)
  expect(parseDate('1970-31-01')).toStrictEqual(sampleDate)
  expect(parseDate('01-31-70')).toStrictEqual(sampleDate)
})