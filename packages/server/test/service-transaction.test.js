import TransactionService from '../src/service/transaction-service'

const mockUploadRepo = {
  get: jest.fn(),
  set: jest.fn(),
}
const mockTransactionRepo = {
  get: jest.fn(),
  set: jest.fn(),
}

function fakeFile(data, options) {
  return {
    ...options,
    toBuffer: async () => Buffer.from(data),
  }
}

describe('Test transaction service', () => {
  let service

  beforeEach(async (done) => {
    jest.resetAllMocks()
    service = new TransactionService({
      transactionRepository: mockTransactionRepo,
      uploadRepository: mockUploadRepo,
    })
    done()
  })

  afterAll(async (done) => {
    jest.clearAllMocks()
    done()
  })

  it('Account repository: get', async () => {
    const data = `how much,when,what
123.00, 2020-10-02, some description
-123.00, 2020-10-02, some description
00.99, 2020-10-02, some description`

    const file = fakeFile(data, {
      mimetype: 'text/csv',
    })

    const result = await service.createFromFile(1, file)
    expect(1).toEqual(2)

    // const response = await app.inject({
    //   method: 'GET',
    //   url: '/',
    // })
    // expect(response.statusCode).toStrictEqual(404)
  })
})
