import Fastify from 'fastify'
import fastifyMultipart from 'fastify-multipart'

const server = (options) => {
  const fastify = Fastify(options)

  fastify.get('/test', async (request, response) => {
    response.type('application/json').code(200)
    return { hello: 'world' }
  })

  return fastify
}

export default server