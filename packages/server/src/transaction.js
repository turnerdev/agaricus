export default class Transaction {

  constructor(db) {
    this.db = db
  }

  async getAll() {
    return this.db.query('SELECT * FROM transactions')
  }

}