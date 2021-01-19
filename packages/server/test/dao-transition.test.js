import knex from 'knex'
import TransactionDao from '../src/dao/transaction-dao'

describe('Test transaction data access', () => {
  let db
  let dao
  const transaction = {
    account_id: 1,
    upload_id: 1,
    date: new Date('2020-02-08').getTime(),
    description: 'Rent',
    amount: 500,
    row: '2020-02-08,Rent,500',
  }

  beforeEach(async (done) => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: ':memory:',
      migrations: {
        directory: './migrations/',
      },
    })
    await db.migrate.rollback()
    await db.migrate.latest()
    await db.seed.run({
      directory: './test',
      specific: 'seed.js',
    })
    dao = new TransactionDao({ db })
    done()
  })

  afterAll(async (done) => {
    await db.migrate.rollback()
    jest.clearAllMocks()
    done()
  })

  it('Transaction data access: create, read', async () => {
    const [id] = await dao.insert(transaction)
    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].date).toEqual(transaction.date)
  })

  it('Transaction data access: update', async () => {
    const description = 'Apartment'
    const amount = 1000
    const [id] = await dao.insert(transaction)

    await dao.update({ id, description, amount })
    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].description).toEqual(description)
    expect(result[0].amount).toEqual(amount)
    expect(result[0].date).toEqual(transaction.date)
  })

  it('Transaction data access: delete', async () => {
    const resultBefore = await dao.getById(1)
    await dao.delete(1)
    const resultAfter = await dao.getById(1)

    expect(resultBefore.length).toEqual(1)
    expect(resultAfter.length).toEqual(0)
  })

  it('Transaction data access: find all', async () => {
    const result = await dao.findByQuery({ query: '' })
    expect(result.length).toEqual(4)
  })

  it('Transaction data access: find with case insensitive substring', async () => {
    const result = await dao.findByQuery({ query: 'Internet' })
    expect(result.length).toEqual(1)
  })

  it('Transaction data access: find by category', async () => {
    await dao.insert({ ...transaction, category_id: 1 })
    const results = [
      await dao.findByQuery({ categories: [1] }),
      await dao.findByQuery({ categories: [null] }),
    ]
    expect(results[0].length).toEqual(1)
    expect(results[1].length).toEqual(4)
  })

  it('Transaction data access: find by date', async () => {
    const allResults = await dao.findByQuery({})
    const dates = allResults.map((transaction) => new Date(transaction.date))
    const earliestDate = new Date(Math.min(...dates))
    const latestDate = new Date(Math.max(...dates))

    const inclusiveResults = await dao.findByQuery({
      dateFrom: earliestDate,
      dateTo: latestDate,
    })

    // Contract filter range by 1 day from earliest/latest
    const dateFrom = new Date(earliestDate)
    const dateTo = new Date(latestDate)
    dateFrom.setDate(earliestDate.getDate() + 1)
    dateTo.setDate(latestDate.getDate() - 1)
    const filteredResults = await dao.findByQuery({
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0],
    })

    expect(allResults.length).toEqual(4)
    expect(inclusiveResults.length).toEqual(4)
    expect(filteredResults.length).toEqual(2)
  })

  it('Transaction data access: find with pagination', async () => {
    const results = [
      await dao.findByQuery({ page: 1, perPage: 2 }),
      await dao.findByQuery({ page: 2, perPage: 2 }),
      await dao.findByQuery({ page: 1, perPage: 3 }),
    ]

    expect(results[2][0]).toEqual(results[0][0])
    expect(results[2][1]).toEqual(results[0][1])
    expect(results[2][2]).toEqual(results[1][0])
  })

  it('Transaction data access: count', async () => {
    await dao.insert({ ...transaction, category_id: 1 })
    const categoryFilteredResults = [
      await dao.count({ categories: [1] }),
      await dao.count({ categories: [null] }),
    ]

    const allResults = await dao.findByQuery({})
    const allResultsCount = await dao.count({})

    const dates = allResults.map((transaction) => new Date(transaction.date))
    const earliestDate = new Date(Math.min(...dates))
    const latestDate = new Date(Math.max(...dates))

    // Contract filter range by 1 day from earliest/latest
    const dateFrom = new Date(earliestDate)
    const dateTo = new Date(latestDate)
    dateFrom.setDate(earliestDate.getDate() + 1)
    dateTo.setDate(latestDate.getDate() - 1)
    const dateFilteredResults = await dao.count({
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0],
    })

    expect(categoryFilteredResults[0]).toEqual(1)
    expect(categoryFilteredResults[1]).toEqual(4)
    expect(allResults.length).toEqual(allResultsCount)
    expect(dateFilteredResults).toEqual(3)
  })
})
