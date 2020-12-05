import sqlite from 'sqlite3'
import crypto from 'crypto'
import path from 'path'

const setup = [
  `CREATE TABLE transactions( 
    id CHARACTER(32) PRIMARY KEY NOT NULL,
    row TEXT,
    date DATETIME NOT NULL,
    account NVARCHAR(64) NOT NULL,
    payee NVARCHAR(64),
    description NVARCHAR(256),
    category NVARCHAR(64),
    credit DECIMAL(10, 2),
    debit DECIMAL(10, 2),
    currency CHAR(3)
  )`
]

const seed_data = [
  { sql: 'INSERT INTO transactions (id, row, date, account, description, credit, debit) VALUES (?,?,?,?,?,?,?)',
    data: [
      '2020-11-26, Current, Internet,78.35,',
      '2020-11-23, Current, Tax Rebate,,445.84',
      '2020-11-21, Credit, Furniture,800.50,']
  }
]

function hash(input) {
  return crypto.createHash('md5')
    .update(input, 'utf8')
    .digest('hex')
}

function parseRow(row) {
  return [hash(row), row, ...row.split(',').map(value => value.trim())];
}

export default class Database {

  constructor(name) {
    const base = process.cwd();
    const file_path = path.join(base, 'data', `${name}.db`)
    this.db = new sqlite.Database(file_path)
  }

  async setup() {
    for await (const sql of setup) {
      await this.run(sql)
    }
    for await (const seed of seed_data) {
      for (const data of seed.data) {
        await this.run(seed.sql, parseRow(data))
      }
    }
  }

  async run(...args) {
    return new Promise((resolve, reject) => {
      this.db.run(...args, error => {
        if (error)
          reject(error)
        else
          resolve(true)
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

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close()
      resolve(true)
    }) 
  }

}