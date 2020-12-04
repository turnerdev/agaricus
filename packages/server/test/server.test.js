import { jest } from '@jest/globals';
import server from '../src/server.js'

describe('Test API server', () => {

  it('Test sample route', async () => {
    const app = server()
    
    const response = await app.inject({
      method: 'GET',
      url: '/test'
    })

    expect(response.json()).toStrictEqual({ hello: 'world' })
  })

})