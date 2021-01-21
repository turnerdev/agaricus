import Server from '../src/server.js'
import * as fastifyUtils from '../src/utils/fastify'

describe('Test server API', () => {
  let app
  let querystringParser

  beforeAll(() => {})

  afterAll(() => {})

  beforeEach(async () => {
    jest.restoreAllMocks()
    querystringParser = jest.spyOn(fastifyUtils, 'querystringParser')
    app = await Server()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Test 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    })
    await app.close()
    expect(response.statusCode).toStrictEqual(404)
  })

  it('Test querystring plugin', async () => {
    const aquerystringParser = jest.spyOn(fastifyUtils, 'querystringParser')
    const response = await app.inject({
      method: 'GET',
      url: '/?param1=[1,2, 3]&param2=1,2,3&param3=[1,2 3]',
    })

    expect(querystringParser).toHaveBeenCalled()
    expect(querystringParser).toHaveReturnedWith({
      param1: [1, 2, 3],
      param2: '1,2,3',
      param3: '[1,2 3]',
    })
  })

  it('Test database injection', async () => {
    const db = app.diContainer.resolve('db')
    expect(db).not.toEqual(null)
  })
})
