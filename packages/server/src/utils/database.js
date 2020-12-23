import sqlite from 'sqlite3'
import path from 'path'

const setup = [
  `CREATE TABLE imports(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creation_date datetime default current_timestamp,
    filename TEXT
  )`,
  `CREATE TABLE categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creation_date datetime default current_timestamp,
    name TEXT,
    UNIQUE(name)
  )`,
  `CREATE TABLE transactions( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    import_id INTEGER NOT NULL,
    category_id INTEGER,
    creation_date datetime default current_timestamp,
    hash CHARACTER(32) NOT NULL,
    row TEXT,
    message TEXT,
    date DATETIME NOT NULL,
    account NVARCHAR(64) NOT NULL,
    payee NVARCHAR(64),
    description NVARCHAR(256),
    amount DECIMAL(10, 2),
    currency CHAR(3),
    FOREIGN KEY (import_id) REFERENCES imports(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`
]

export default class Database {

  constructor(name) {
    const base = process.cwd();
    const file_path = path.join(base, 'data', `${name}.db`)
    this.db = new sqlite.Database(file_path)
  }

  async setup() {
    await this.run('PRAGMA foreign_keys = ON')
    for await (const sql of setup) {
      await this.run(sql)
    }
  }

  async run(...args) {
    return new Promise((resolve, reject) => {
      this.db.run(...args, function (error) {
        if (error)
          reject(error)
        else
          resolve(this)
      })
    })
  }

  async query(...args) {
    return new Promise((resolve, reject) => {
      this.db.all(...args, (error, rows) => {
        if (error)
          reject(error)
        else
          resolve(rows)
      })
    })
  }

  async get(...args) {
    return new Promise((resolve, reject) => {
      this.db.get(...args, (error, row) => {
        if (error)
          reject(error)
        else
          resolve(row)
      })
    })
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close()
      resolve(true)
    }) 
  }

  params(obj) {
    return Object.keys(obj).reduce((params, key) => ({
      ...params,
      [`$${key}`]: obj[key]
    }), {})
  }

}