import knex from 'knex'
import AccountDao from '../src/dao/account-dao'

describe('Test account repository', () => {
  let db
  let dao

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
    dao = new AccountDao({ db })
    done()
  })

  afterAll(async (done) => {
    await db.migrate.rollback()
    jest.clearAllMocks()
    done()
  })

  it('Account data access: create, read', async () => {
    const name = 'Test Account'
    const currency = 'GBP'
    const [id] = await dao.insert({
      name,
      currency,
    })

    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(name)
  })

  it('Account data access: update', async () => {
    const name = 'Test Account'
    const newName = `David's Account`
    const currency = 'GBP'
    const [id] = await dao.insert({
      name,
      currency,
    })

    await dao.update({ id, name: newName })
    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(newName)
  })

  it('Account data access: update', async () => {
    const resultBefore = await dao.getById(1)

    await dao.delete(1)
    const resultAfter = await dao.getById(1)

    expect(resultBefore.length).toEqual(1)
    expect(resultAfter.length).toEqual(0)
  })

  it('Account data access: find all', async () => {
    const result = await dao.findByQuery({ query: '' })
    expect(result.length).toEqual(3)
  })

  it('Account data access: find with case insensitive substring', async () => {
    const result = await dao.findByQuery({ query: 'anna' })
    expect(result.length).toEqual(2)
  })
})
