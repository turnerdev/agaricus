export default function (app) {
  app.get('/accounts/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      response: {
        200: app.getSchema('account-existing'),
        404: {},
      },
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      const record = await accountRepository.get(id)
      if (record.length > 0) {
        response.type('application/json').code(200).send(record[0])
      } else {
        response.code(404).send()
      }
    },
  })

  app.get('/accounts', {
    schema: {
      querystring: {
        query: { type: 'string', default: '' },
      },
      response: {
        200: {
          type: 'array',
          items: {
            $ref: 'account-response#',
          },
        },
      },
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const records = await accountRepository.find(request.query)
      response.type('application/json').code(200).send(records)
    },
  })

  app.post('/accounts', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          currency: { type: 'string', minLength: 3, maxLength: 3 },
        },
        required: ['name', 'currency'],
        additionalProperties: false,
      },
      response: {
        204: {},
      },
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const result = await accountRepository.set(request.body)
      const recordId = result[0]
      if (recordId.length === 1) {
        response.header('Location', `/accounts/${result[0]}`)
      }
      // TODO: UNIQUE constraint failed: accounts.name
      response.type('application/json').code(204).send()
    },
  })

  app.patch('/accounts/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          currency: { type: 'string', minLength: 3, maxLength: 3 },
        },
        additionalProperties: false,
      },
      response: {
        204: {},
      },
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      const result = await accountRepository.set({
        id,
        ...request.body,
      })
      response.type('application/json').code(204).send()
    },
  })

  app.delete('/accounts/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      response: {
        204: {},
        404: {},
      },
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      if (await accountRepository.delete(id)) {
        response.type('application/json').code(204).send()
      } else {
        response.type('application/json').code(404).send()
      }
    },
  })
}
