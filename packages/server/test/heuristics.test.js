import {
  predictDateFormat,
  predictAmountFormat,
  parseAmount,
  parseDate,
} from '../src/utils/heuristics'

describe('Test amount parsing heuristics', () => {
  it('Test amount predictions', async () => {
    const values = [
      '($23.23)',
      '-12.00',
      '(1.23)',
      '($42.34)',
      '34.12',
      '$23.23',
    ]
    const result = predictAmountFormat(values)
    expect(result.accounting).toBe(3)
    expect(result.positive).toBe(2)
    expect(result.negative).toBe(1)
  })

  it('Test positive amount parsing', async () => {
    const result = parseAmount('1.23')
    expect(result).toEqual(1.23)
  })

  it('Test negative amount parsing', async () => {
    const result = parseAmount('-1.23')
    expect(result).toEqual(-1.23)
  })

  it('Test `accounting` amount parsing', async () => {
    const result = parseAmount('(0.40)')
    expect(result).toEqual(-0.4)
  })

  it('Test invalid amount parsing', async () => {
    expect(() => {
      parseAmount('abc')
    }).toThrow()
  })
})

describe('Test date parsing heuristics', () => {
  it('Test ambiguous format', async () => {
    expect(() => {
      parseDate('01/10/2020')
    }).toThrow()
  })

  it('Test contextual heuristics', async () => {
    const samples = ['01/10/2020', '24/02/2020']
    expect(predictDateFormat(samples).length).toBe(1)
  })

  it('Test unambiguous date parsing', async () => {
    const sampleDateText = '31 Jan 1970 00:00:00'
    const sampleDate = new Date(sampleDateText)

    expect(parseDate('31/01/1970')).toStrictEqual(sampleDate)
    expect(parseDate('01-31-1970')).toStrictEqual(sampleDate)
    expect(parseDate('1970-31-01')).toStrictEqual(sampleDate)
    expect(parseDate('01-31-70')).toStrictEqual(sampleDate)
  })

  it('Test date parsing with format', () => {
    const date = new Date(new Date().toISOString().split('T')[0])
    const pattern = RegExp('^(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})$')
    const input = [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      (date.getDate() + 1).toString().padStart(2, '0'),
    ].join('-')
    const result = new Date(
      parseDate(input, pattern).toISOString().split('T')[0]
    )
    expect(result).toEqual(date)
  })
})
