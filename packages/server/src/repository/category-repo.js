import BaseRepository from "./base-repo.js"

export default class CategoryRepository extends BaseRepository {
  constructor({ categoryDao }) {
    super(categoryDao)
    this.categoryDao = categoryDao
  }

  async find(params) {
    return this.categoryDao.findByQuery(params)
  }
}