export default function (app) {
  app.get('/transactions', {
    schema: {
      querystring: {
        query: { type: 'string', default: '' },
        page: { type: 'integer', minimum: 1, default: 1 },
        perPage: { type: 'integer', minimum: 1, default: 10 },
        dateFrom: { type: 'string', format: 'date' },
        dateTo: { type: 'string', format: 'date' },
        categories: {
          type: 'array',
          items: { type: 'integer', nullable: true },
        },
      },
      response: {
        200: {
          count: { type: 'integer' },
          items: {
            type: 'array',
            items: { $ref: 'transaction-existing#' },
          },
        },
      },
    },
    handler: async (request, response) => {
      const transactionRepository = request.diScope.resolve(
        'transactionRepository'
      )
      const transactionDao = request.diScope.resolve('transactionDao')

      const items = await transactionRepository.find(request.query)
      const count = await transactionDao.count(request.query)

      response.type('application/json').code(200).send({
        count,
        items,
      })
    },
  })

  app.get('/transactions/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      response: {
        200: app.getSchema('transaction-existing'),
        404: {},
      },
    },
    handler: async (request, response) => {
      const transactionRepository = request.diScope.resolve(
        'transactionRepository'
      )
      const { id } = request.params
      const record = await transactionRepository.get(id)

      if (record.length > 0) {
        response.type('application/json').code(200).send(record[0])
      } else {
        response.code(404).send()
      }
    },
  })

  app.patch('/transactions/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      body: app.getSchema('transaction-existing'),
    },
    handler: async (request, response) => {
      const transactionRepository = request.diScope.resolve(
        'transactionRepository'
      )
      const result = await transactionRepository.set(request.body)

      response.type('application/json').code(204).send()
    },
  })
}
