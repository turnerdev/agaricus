export default function (app) {

  app.get('/accounts/:id', {
    schema: {
      params: {
        id: { "type": "integer" }
      },
      response: {
        200: app.getSchema('account-existing'),
        404: { }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      const record = await accountRepository.get(id)
        
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

  app.patch('/accounts/:id', {
    schema: {
      params: {
        id: { "type": "integer" }
      },
      body: app.getSchema('account-base'),
      response: {
        204: { }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      const result = await accountRepository.set({
        id,
        ...request.body
      })

      console.log(result)

      response
        .type('application/json')
        .code(204)
        .send()
    }
  })

  app.delete('/accounts/:id', {
    schema: {
      params: {
        id: { "type": "integer" }
      },
      response: {
        204: { },
        404: { }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const { id } = request.params
      
      if (await accountRepository.delete(id)) {
        response
          .type('application/json')
          .code(204)
          .send()
      } else {
        response
          .type('application/json')
          .code(404)
          .send()
      }
    }
  })

  app.get('/accounts', {
    schema: {
      querystring: {
        query: { type: 'string', default: '' }
      },
      response: {
        200: {
          type: 'array',
          items: { 
            $ref: 'account-existing#' 
          }
        }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const records = await accountRepository.find(request.query)

      response
        .type('application/json')
        .code(200)
        .send(records)
    }
  })
  

  app.post('/accounts', {
    schema: {
      body: {
        anyOf: [
          app.getSchema('account-base'),
          {
            type: 'array',
            items: { $ref: 'account-base#' }
          }
        ]
      },
      response: {
        204: { }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const result = await accountRepository.set(request.body)
      const recordId = result[0]
      if (recordId.length === 1) { 
        response.header('Location', `/accounts/${result[0]}`)
      }
      // TODO: UNIQUE constraint failed: accounts.name
      response
        .type('application/json')
        .code(204)
        .send()
    }
  })

  app.patch('/accounts', {
    schema: {
      body: {
        type: 'array',
        items: app.getSchema('account-existing')
      },
      response: {
        204: { }
      }
    },
    handler: async (request, response) => {
      const accountRepository = request.diScope.resolve('accountRepository')
      const result = await accountRepository.set(request.body)
      console.log(request.body)
      console.log('Patch results', result)

      response
        .type('application/json')
        .code(204)
        .send()
    }
  })

}