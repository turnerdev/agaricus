import BaseDAO from './base-dao.js'

export default class AccountDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'accounts')
  }
}