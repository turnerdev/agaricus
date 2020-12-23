export async function getCategories(request, response) {
  const sql  = 'SELECT id, name, row_number() over(order by id) as row_number FROM categories'
  const result = await this.db.query(sql)

  response
    .type('application/json')
    .code(200)
    .send(result)
}

export async function postCategory(request, response) {
  const sql = 'INSERT INTO categories (name) VALUES (?)'
  const params = [request.body.name]
  const result = await this.db.run(sql, params)
  
  response
    .type('application/json')
    .header('Location', `/categories/${result.lastID}`)
    .code(201)
    .send()
}