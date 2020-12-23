import Database from '../src/utils/database.js'

const mockRun = jest.fn((...args) => { args[args.length-1](false) })
const mockAll = jest.fn((...args) => { args[args.length-1](false, [1, 2, 3]) })
const mockClose = jest.fn()

jest.mock('sqlite3', () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        run: mockRun,
        all: mockAll,
        close: mockClose
      }
    })
  }
})

let database

describe('Test sqlite database wrapper', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
    database = new Database('unittest')
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Setup', async () => {
    await database.setup()
    // expect(mockRun).toBeCalledTimes(1)
  })

  it('Run', async () => {
    await database.run('SELECT * FROM Table')
    expect(mockRun).toBeCalledTimes(1)
  })

  it('Query', async () => {
    const result = await database.query('SELECT * FROM Table')
    expect(mockAll).toBeCalledTimes(1)
    expect(result.length).toBe(3)
  })

  it('Close', async () => {
    await database.close()
    expect(mockClose).toBeCalled()
  })

})