import BaseRepository from './base-repo.js'

export default class AccountRepository extends BaseRepository {
  constructor({ accountDao }) {
    super(accountDao)
    this.accountDao = accountDao
  }

  async find(query) {
    return this.accountDao.findByQuery(query)
  }
}