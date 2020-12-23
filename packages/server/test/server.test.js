import Server from '../src/server.js'
import mockDatabase from '../src/utils/database.js'

const mockGetAll = jest.fn().mockResolvedValue([1, 2, 3])

jest.mock('../src/database.js')
jest.mock('../src/transaction.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAll: mockGetAll
    }
  })
})

let app

describe('Test server API', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
    app = Server()
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Get transactions', async () => {
    // const response = await app.inject({
    //   method: 'GET',
    //   url: '/transactions'
    // })

    // expect(mockDatabase).toBeCalled()
    // expect(mockGetAll).toBeCalledTimes(1)
    // expect(response.json()).toStrictEqual([1, 2, 3])
  })

})