import TransactionRepository from '../src/repository/transaction-repo'

const mockDao = {
  getById: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByQuery: jest.fn(),
}

describe('Test transaction repository', () => {
  let repo

  beforeEach(async (done) => {
    jest.resetAllMocks()
    repo = new TransactionRepository({ transactionDao: mockDao })
    done()
  })

  afterAll(async (done) => {
    jest.clearAllMocks()
    done()
  })

  it('Transaction repository: get', async () => {
    const mockData = { name: 'Hello World' }
    mockDao.getById.mockResolvedValue(mockData)

    const result = await repo.get(1)

    expect(mockDao.getById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockData)
  })

  it('Transaction repository: set insert', async () => {
    mockDao.insert.mockResolvedValue()
    const insertResult = await repo.set({ name: '' })
    expect(mockDao.insert).toHaveBeenCalledTimes(1)
  })

  it('Transaction repository: set update', async () => {
    mockDao.update.mockResolvedValue()
    const updateResult = await repo.set({ id: 1, name: '' })
    expect(mockDao.update).toHaveBeenCalledTimes(1)
  })

  it('Transaction repository: delete', async () => {
    mockDao.delete.mockResolvedValue()
    const updateResult = await repo.delete(1)
    expect(mockDao.delete).toHaveBeenCalledTimes(1)
  })

  it('Transaction repository: find', async () => {
    mockDao.findByQuery.mockResolvedValue()
    const findResult = await repo.find({})
    expect(mockDao.findByQuery).toHaveBeenCalledTimes(1)
  })
})
