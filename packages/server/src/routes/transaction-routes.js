export default function(app) {

  app.get('/transactions', {
    schema: {
      querystring: {
        query: { type: 'string', default: '' },
        page: { type: 'integer', minimum: 1, default: 1 },
        perPage: { type: 'integer', minimum: 1, default: 10 }
      },
      response: {
        200: {
          items: {
            type: 'array',
            items: { $ref: 'transaction-existing#' }
          }
        }
      }
    },
    handler: async (request, response) => {
      const transactionService = request.diScope.resolve('transactionService')
      const records = await transactionService.findTransactions(request.query)

      response
        .type('application/json')
        .code(200)
        .send({
          items: records
        })
    }
  })

  app.get('/transactions/:id', {
    schema: {
      params: {
        transactionId: { "type": "integer" }
      },
      response: {
        200: app.getSchema('transaction-existing'),
        404: { }
      }
    },
    handler: async (request, response) => {
      const transactionService = request.diScope.resolve('transactionService')
      const { id } = request.params
      const record = await transactionService.getTransaction(id)

      if (record.length > 0) {
        response
          .type('application/json')
          .code(200)
          .send(record[0])
      } else {
        response
          .code(404)
          .send()
      }
    }
  })

}