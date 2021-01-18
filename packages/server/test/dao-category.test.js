import knex from 'knex'
import CategoryDao from '../src/dao/category-dao'

describe('Test category data access', () => {
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
    dao = new CategoryDao({ db })
    done()
  })

  afterAll(async (done) => {
    await db.migrate.rollback()
    jest.clearAllMocks()
    done()
  })

  it('Category data access: create, read', async () => {
    const name = 'Test Category'
    const [id] = await dao.insert({
      name,
      color: '#000000',
    })
    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(name)
  })

  it('Category data access: update', async () => {
    const name = 'Test Category'
    const newName = 'Savings'
    const [id] = await dao.insert({
      name,
      color: '#000000',
    })

    await dao.update({ id, name: newName })
    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(newName)
  })

  it('Category data access: delete', async () => {
    const resultBefore = await dao.getById(1)
    await dao.delete(1)
    const resultAfter = await dao.getById(1)

    expect(resultBefore.length).toEqual(1)
    expect(resultAfter.length).toEqual(0)
  })

  it('Category data access: find all', async () => {
    const result = await dao.findByQuery({ query: '' })
    expect(result.length).toEqual(2)
  })

  it('Category data access: find with case insensitive substring', async () => {
    const result = await dao.findByQuery({ query: 'util' })
    expect(result.length).toEqual(1)
  })
})
