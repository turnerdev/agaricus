export default function (app) {
  app.get('/categories/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      response: {
        200: app.getSchema('category-existing'),
        404: {},
      },
    },
    handler: async (request, response) => {
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const { id } = request.params
      const record = await categoryRepository.get(id)

      if (record.length > 0) {
        response.type('application/json').code(200).send(record[0])
      } else {
        response.code(404).send()
      }
    },
  })

  app.patch('/categories/:id', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      body: app.getSchema('category-base'),
      response: {
        204: {},
      },
    },
    handler: async (request, response) => {
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const { id } = request.params
      const result = await categoryRepository.set({
        id,
        ...request.body,
      })

      response.type('application/json').code(204).send()
    },
  })

  app.delete('/categories/:id', {
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
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const { id } = request.params

      if (await categoryRepository.delete(id)) {
        response.type('application/json').code(204).send()
      } else {
        response.type('application/json').code(404).send()
      }
    },
  })

  app.get('/categories', {
    schema: {
      querystring: {
        query: { type: 'string', default: '' },
      },
      response: {
        200: {
          type: 'array',
          items: {
            $ref: 'category-existing#',
          },
        },
      },
    },
    handler: async (request, response) => {
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const records = await categoryRepository.find(request.query)

      response.type('application/json').code(200).send(records)
    },
  })

  app.post('/categories', {
    schema: {
      body: {
        anyOf: [
          app.getSchema('category-base'),
          {
            type: 'array',
            items: { $ref: 'category-base#' },
          },
        ],
      },
      response: {
        204: {},
      },
    },
    handler: async (request, response) => {
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const result = await categoryRepository.set(request.body)
      const recordId = result[0]
      if (recordId.length === 1) {
        response.header('Location', `/categories/${result[0]}`)
      }

      // TODO: Handle UNIQUE constraint failure: categories.name
      response.type('application/json').code(204).send()
    },
  })

  app.patch('/categories', {
    schema: {
      body: {
        type: 'array',
        items: app.getSchema('category-existing'),
      },
      response: {
        204: {},
      },
    },
    handler: async (request, response) => {
      const categoryRepository = request.diScope.resolve('categoryRepository')
      const result = await categoryRepository.set(request.body)

      response.type('application/json').code(204).send()
    },
  })
}
