import knex from 'knex'
import UploadDao from '../src/dao/upload-dao'

describe('Test upload data access', () => {
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
    dao = new UploadDao({ db })
    done()
  })

  afterAll(async (done) => {
    await db.migrate.rollback()
    jest.clearAllMocks()
    done()
  })

  it('Upload data access: create, read', async () => {
    const name = 'Test Upload'

    const [id] = await dao.insert({
      name,
    })

    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(name)
  })

  it('Upload data access: update', async () => {
    const name = 'Test Upload'

    const [id] = await dao.insert({
      name,
    })

    const result = await dao.getById(id)

    expect(result[0].id).toEqual(id)
    expect(result[0].name).toEqual(name)
  })

  it('Upload data access: update', async () => {
    const resultBefore = await dao.getById(1)
    await dao.delete(1)
    const resultAfter = await dao.getById(1)

    expect(resultBefore.length).toEqual(1)
    expect(resultAfter.length).toEqual(0)
  })
})
