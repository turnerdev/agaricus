import AccountRepository from '../src/repository/account-repo'

const mockDao = {
  getById: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByQuery: jest.fn(),
}

describe('Test account repository', () => {
  let repo

  beforeEach(async (done) => {
    jest.resetAllMocks()
    repo = new AccountRepository({ accountDao: mockDao })
    done()
  })

  afterAll(async (done) => {
    jest.clearAllMocks()
    done()
  })

  it('Account repository: get', async () => {
    const mockData = { name: 'Hello World' }
    mockDao.getById.mockResolvedValue(mockData)

    const result = await repo.get(1)

    expect(mockDao.getById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockData)
  })

  it('Account repository: set insert', async () => {
    mockDao.insert.mockResolvedValue()
    const insertResult = await repo.set({ name: '' })
    expect(mockDao.insert).toHaveBeenCalledTimes(1)
  })

  it('Account repository: set update', async () => {
    mockDao.update.mockResolvedValue()
    const updateResult = await repo.set({ id: 1, name: '' })
    expect(mockDao.update).toHaveBeenCalledTimes(1)
  })

  it('Account repository: delete', async () => {
    mockDao.delete.mockResolvedValue()
    const updateResult = await repo.delete(1)
    expect(mockDao.delete).toHaveBeenCalledTimes(1)
  })

  it('Account repository: find', async () => {
    mockDao.findByQuery.mockResolvedValue()
    const findResult = await repo.find({})
    expect(mockDao.findByQuery).toHaveBeenCalledTimes(1)
  })
})
