export default function(app) {
  // "getUploads": {
  //   "response": {
  //     "200": {
  //       "type": "array",
  //       "items": { "$ref": "uploadSchema#" }
  //     }
  //   }
  // },
  // "uploadFiles": {
  //   "consumes": ["multipart/form-data"]
  // }

// export async function getUploads(request, response) {
//   const transaction = new Transaction(this.db)
//   response
//     .type('application/json')
//     .code(200)
//     .send(await transaction.getImports())
// }

// export async function uploadFiles(request, response) {
//   const transaction = new Transaction(this.db)
//   const parts = await request.files()
//   for await (const part of parts) {
//     await transaction.processFile(part)
//   }
//   response.code(200).send()
// }
  app.post('/uploads', {
    schema: {
      consumes: ["multipart/form-data"],
      response: {
        204: { },
        500: { }
      }
    },
    handler: async (request, response) => {
      const transactionService = request.diScope.resolve('transactionService')

      const parts = await request.files()
      for await (const part of parts) {
        await transactionService.createFromFile(part)
      }

      response
        .type('application/json')
        .code(204)
    }
  })

}