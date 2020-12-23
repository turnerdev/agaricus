import BaseRepository from './base-repo.js'

export default class TransactionRepository extends BaseRepository {
  constructor({ transactionDao }) {
    super(transactionDao)
    this.transactionDao = transactionDao
  }

  async find(params) {
    return this.transactionDao.findByQuery(params)
  }
}