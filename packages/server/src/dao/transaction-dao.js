import BaseDAO from './base-dao.js'

export default class TransactionDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'transactions')
  }

  async findByQuery(query, page, perPage) {
    console.log(query, page ,perPage)
    return this.db(this.table)
      .where('row', 'like', `%${query}%`)
      .offset(page*perPage)
      .limit(perPage)
  }

  // async insert(record) {
  //   return this.db('transactions')
  //     .inser

  //   // const sql = 'INSERT INTO transactions (hash, row, date, account, description, credit, debit) VALUES (?,?,?,?,?,?,?)'
  //   // for (const record of records) {
  //   //   await this.db.run(sql, parseRow(record))
  //   // }
  //   // const trx = await db.transaction();
  //   // try {
  //   //   const catIds = await trx('catalogues').insert({name: 'Old Books'});
  //   //   const bookIds = await trx('books').insert({catId: catIds[0], title: 'Canterbury Tales' });
  //   //   await trx.commit();
  //   // } catch (error) {
  //   //   await trx.rollback(error);
  //   // }
  // }

  // async update(record) {
  //   // const fields = Object.keys(record).filter(key => key !== 'id').map(key => `${key}=$${key}`).join(',')
  //   // const sql = `UPDATE transactions SET ${fields} WHERE id=$id`
  //   // const params = this.db.params(record)
  //   // console.log(params)
  //   // return await this.db.run(sql, params)
  // }

}