import Transaction from '../transaction.js'

export default function(app) {

  app.get('/ptransaction/:transactionId', {
    schema: {
      response: {
        200: { $ref: 'transactionSchema#' }
      },
      params: {
        transactionId: { "type": "integer" }
      }
    },
    handler: async (request, response) => {
      const transaction = new Transaction(app.db)
      const record = await transaction.getById(request.params.transactionId)
      console.log(record)
      console.log('ya)')
      response
        .type('application/json')
        .code(200)
        .send(record)
    }
  })

}

export async function getTransactions(request, response) {
  const transaction = new Transaction(this.db)
  const { query, page, perPage } = request.query
  const results = await transaction.get(query, page, perPage)
  const count = await transaction.count(query)
  response
    .type('application/json')
    .code(200)
    .send({
      count: count,
      page: page,
      perPage: perPage,
      items: results
    })
}

export async function getTransaction(request, response) {
  const transaction = new Transaction(this.db)
  response
    .type('application/json')
    .code(200)
    .send(await transaction.getRaw(request.params.transactionId))
}

export async function patchTransactions(request, response) {
  try {
    const transaction = new Transaction(this.db)
    for await (let record of request.body) {
      await transaction.update(record)
    }
    response.code(204).send()
  } catch (ex) {
    this.log.error(ex)
    response.code(500).send()
  }
}