export default class BaseRepository {
  constructor(dao) {
    if (this.constructor == BaseRepository) {
      throw 'Abstract class cannot be instantiated'
    }
    this.dao = dao
  }

  async get(id) {
    return this.dao.getById(id)
  }

  async set(records) {
    return Promise.all([].concat(records).map(record =>
      record.id == null
        ? this.dao.insert(record)
        : this.dao.update(record)
    ))
  }

  async delete(id) {
    return this.dao.delete(id)
  }
}