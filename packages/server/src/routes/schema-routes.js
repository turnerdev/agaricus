export default function (app) {

  app.get('/schema/:name', {
    schema: {
      params: {
        name: { "type": "string" }
      },
      response: {
        404: { error: { type: 'string' } }
      }
    },
    handler: async (request, response) => {
      const schema = app.getSchema(request.params.name)
      if (schema) {
        response
          .type('application/json')
          .code(200)
          .send(schema)
      } else {
        response
          .code(404)
          .send({ error: 'Not Found' })
      }
    }
  })

}