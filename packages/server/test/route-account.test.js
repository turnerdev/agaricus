import Server from '../src/server.js'
import * as awilix from 'awilix'

// Cannot access 'mock' before initialization
// https://github.com/facebook/jest/issues/10996

// const mock = {
//   createContainer: jest.fn(() => () => ({
//     register: jest.fn(),
//   })),
// }

// jest.mock('awilix', () => ({
//   createContainer: mock.createContainer,
// }))

describe('Test account repository', () => {
  let app

  beforeEach(async (done) => {
    jest.resetAllMocks()
    app = await Server()
    done()
  })

  afterAll(async (done) => {
    jest.clearAllMocks()
    done()
  })

  it('Account repository: get', async () => {
    // const response = await app.inject({
    //   method: 'GET',
    //   url: '/',
    // })
    // expect(response.statusCode).toStrictEqual(404)
  })
})
