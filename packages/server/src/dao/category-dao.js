import BaseDAO from './base-dao.js'

export default class CategoryDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'categories')
  }

  async findByQuery({ query }) {
    return this.db(this.table)
      .where('name', 'like', `%${query}%`)
  }
}