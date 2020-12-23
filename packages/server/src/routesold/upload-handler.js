import Transaction from '../transaction.js'

export async function getUploads(request, response) {
  const transaction = new Transaction(this.db)
  response
    .type('application/json')
    .code(200)
    .send(await transaction.getImports())
}

export async function uploadFiles(request, response) {
  const transaction = new Transaction(this.db)
  const parts = await request.files()
  for await (const part of parts) {
    await transaction.processFile(part)
  }
  response.code(200).send()
}