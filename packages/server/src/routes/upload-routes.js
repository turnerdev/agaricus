export default function (app) {
  app.post('/accounts/:id/upload', {
    schema: {
      params: {
        id: { type: 'integer' },
      },
      consumes: ['multipart/form-data'],
      response: {
        204: {},
        500: {},
      },
    },
    handler: async (request, response) => {
      const transactionService = request.diScope.resolve('transactionService')
      const { id } = request.params

      const parts = await request.files()
      for await (const part of parts) {
        await transactionService.createFromFile(id, part)
      }

      response.type('application/json').code(204)
    },
  })
}
