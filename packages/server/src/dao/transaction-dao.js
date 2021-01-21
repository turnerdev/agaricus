import BaseDAO from './base-dao.js'

export default class TransactionDAO extends BaseDAO {
  constructor({ db }) {
    super(db, 'transactions')
  }

  async findByQuery({ query, page, perPage, dateFrom, dateTo, categories }) {
    const statement = this.db(this.table).where(
      'row',
      'like',
      `%${query || ''}%`
    )

    if (categories) {
      statement.where((builder) => {
        builder.whereIn('category_id', categories)
        if (!!~categories.indexOf(null)) {
          builder.orWhereNull('category_id')
        }
      })
    }

    if (dateFrom && dateTo) {
      statement.whereBetween('date', [
        new Date(dateFrom).getTime(),
        new Date(dateTo).getTime(),
      ])
    }

    if (page && perPage) {
      statement.offset((page - 1) * perPage).limit(perPage)
    }

    return statement
  }

  async count({ query, categories, dateFrom, dateTo }) {
    const statement = this.db(this.table)
      .count('id', { as: 'count' })
      .where('row', 'like', `%${query || ''}%`)

    if (categories) {
      statement.where((builder) => {
        builder.whereIn('category_id', categories)
        if (!!~categories.indexOf(null)) {
          builder.orWhereNull('category_id')
        }
      })
    }

    if (dateFrom && dateTo) {
      statement.whereBetween('date', [
        new Date(dateFrom).getTime(),
        new Date(dateTo).getTime(),
      ])
    }

    const result = await statement
    return result[0].count
  }
}
