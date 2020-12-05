import Fastify from 'fastify'
import fastifyMultipart from 'fastify-multipart'

import Database from './database.js'
import Transaction from './transaction.js'

const server = (options) => {
  const app = Fastify(options)
  const database = new Database('test')
  const transaction = new Transaction(database)
  // database.setup()

  app.get('/transactions', async(request, response) => {
    response.type('application/json').code(200)
    return transaction.getAll() 
  })

  return app
}

export default server