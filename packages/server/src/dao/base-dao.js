export default class BaseDAO {
  constructor(db, table) {
    if (this.constructor == BaseDAO) {
      throw 'Abstract class cannot be instantiated'
    }
    this.db = db
    this.table = table
  }

  async getById(id) {
    return this.db(this.table)
      .where({ id })
  }

  async insert(record) {
    return this.db(this.table)
      .insert(record)
  }

  async update(record) {
    return this.db(this.table)
      .where({ id: record.id })
      .update(record)
  }

  async delete(id) {
    return this.db(this.table)
      .where({ id })
      .del()
  }
}