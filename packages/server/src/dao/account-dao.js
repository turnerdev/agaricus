import BaseDAO from './base-dao.js'

export default class AccountDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'accounts')
  }

  async findByQuery({ query }) {
    return this.db(this.table)
      .select('accounts.*')
      .leftJoin('transactions', 'accounts.id', '=', 'transactions.account_id')
      .countDistinct('transactions.upload_id as uploads')
      .count('transactions.id as transactions')
      .sum('transactions.amount as total')
      .groupBy('accounts.id')
      .where('name', 'like', `%${query}%`)
  }
}
