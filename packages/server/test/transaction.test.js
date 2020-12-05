import mockDatabase from '../src/database.js'
import Transaction from '../src/transaction.js'

const mockQuery = jest.fn().mockResolvedValue([1, 2, 3])

jest.mock('../src/database.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      query: mockQuery
    }
  })
})

let transaction

describe('Transaction service', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
    transaction = new Transaction(new mockDatabase())
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Get transactions', async () => {
    const result = await transaction.getAll()
    expect(result).toStrictEqual([1, 2, 3])
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

})