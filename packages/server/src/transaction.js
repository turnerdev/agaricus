import crypto from 'crypto'
import { hasHeaderRows, predictDateFormat, predictAmountFormat, parseDate, parseAmount } from './utils/heuristics.js'
import parse from 'csv-parse/lib/sync.js'
import { mean } from './utils/statistics.js'

function hash(input) {
  return crypto.createHash('md5')
    .update(input, 'utf8')
    .digest('hex')
}

function parseRow(row) {
  return [hash(row), row, ...row.split(',').map(value => value.trim())];
}

const FieldType = Object.freeze({
  DATE: Symbol('DATE'),
  AMOUNT: Symbol('AMOUNT'), 
  CURRENCY: Symbol('CURRENCY'),
  DESCRIPTION: Symbol('DESCRIPTION')
})

// Dataframe
async function analyseRecords(records) {
  const numColumns = records[0].length 
  const fieldPredictions = new Array(numColumns).fill(0).map(_ => []) 

  function* makeFieldIterator(records, field) {
    let i = 0;
    while (i < records.length) {
      yield records[i++][field]
    }
  }
 
  for (let col = 0; col < numColumns; col++) {
    console.log(`-- Column ${col+1}`)
    const datePredictions = predictDateFormat(makeFieldIterator(records, col))
    if (datePredictions.length > 0) {
      fieldPredictions[col].push({
        fieldType: FieldType.DATE,
        predictions: datePredictions
      })
    }

    const amountPredictions = predictAmountFormat(makeFieldIterator(records, col))
    const totalAmountPredictions = Object.values(amountPredictions).reduce((a, b) => a + b, 0)
    if (totalAmountPredictions > 0) {
      // console.log('Sample', records[0][col])
      // console.log('Amount predictions')
      // console.log(amountPredictions)
      fieldPredictions[col].push({
        fieldType: FieldType.AMOUNT,
        predictions: {
          ...amountPredictions,
          total: totalAmountPredictions
        }
      })
    }
  }

  return fieldPredictions
}


export default class Transaction {

  constructor(db) {
    this.db = db
  }

  async getAll() {
    return this.db.query('SELECT * FROM transactions')
  }

  async getById(id) {
    return this.db.get('SELECT id, hash, date, row, message, amount, description, category_id FROM transactions WHERE id = $id', {
      $id: id
    })
  }

  // TODO: Remove (Temporary)
  async getRaw(id) {
    if (id)
      return this.db.get('SELECT id, hash, date, row, message, amount, description, category_id FROM transactions WHERE id = $id', {
        $id: id
      })
    else
      return this.db.query('SELECT id, hash, date, row, message, amount, description, category_id FROM transactions LIMIT 10')
  }

  async count(query) {
    const sql = 'SELECT COUNT(id) FROM transactions WHERE description LIKE $query --case-insensitive'
    const params = {
      $query: '%'+(query||'')+'%'
    }
    const result = await this.db.query(sql, params)
    return result[0]['COUNT(id)']
  }

  async get(query, page, perPage) {
    const sql = 'SELECT id, date, amount, description, category_id FROM transactions WHERE description LIKE $query ORDER BY date DESC LIMIT $limit OFFSET $offset --case-insensitive'
    const params = {
      $query: '%'+(query||'')+'%',
      $limit: perPage || 10,
      $offset: (page-1) * perPage || 0
    }
    return this.db.query(sql, params)
  }

  async getImports() {
    return this.db.query('SELECT id, filename FROM imports ORDER BY id DESC')
  }

  async update(record) {
    const fields = Object.keys(record).filter(key => key !== 'id').map(key => `${key}=$${key}`).join(',')
    const sql = `UPDATE transactions SET ${fields} WHERE id=$id`
    const params = this.db.params(record)
    console.log(params)
    return await this.db.run(sql, params)
  }

  async processFile(file) {
    switch (file.mimetype) {
      case 'text/csv':
        // TODO: fix naive parsing, multiline csv
        const data = (await file.toBuffer()).toString()
        if (data.length > 0)
          return this.processCsv(file.filename, data)
        return false
    }
  }


  async processCsv(filename, data) {
    // Parse CSV data
    let records = parse(data, {
      skip_empty_lines: true
    })

    // Detect header rows
    let headerRows = hasHeaderRows(records.map(record => record.join('')))
    records = records.slice(headerRows)

    // Predict column formats
    const predictions = await analyseRecords(records)

    const predictionMap = {
      [FieldType.DATE]: [],
      [FieldType.DESCRIPTION]: [],
      [FieldType.AMOUNT]: []
    }

    // Compile predictions
    console.log('Compiling predictions')
    for (let i=0; i<predictions.length; i++) {
      if (predictions[i].length > 0) {
        const prediction = predictions[i][0];
        predictionMap[prediction.fieldType].push({
          column: i,
          predictions: prediction.predictions
        })
      } 
    }

    if (predictionMap[FieldType.DATE].length > 1) {
      const potentialDateFields = predictionMap[FieldType.DATE]
      const minCount = new Array(potentialDateFields.length).fill(0)
      for (let record of records) {
          // TODO: get earliest of dates columns
      }
    }

    const totalRecords = records.length
    let amounts = new Array(totalRecords).fill(0)
    console.log(predictionMap[FieldType.AMOUNT])
    if (predictionMap[FieldType.AMOUNT].length === 1) {
      let column = predictionMap[FieldType.AMOUNT][0].column
      for(let i in records) {
        let valuea = records[i][column]
        amounts[i] = parseAmount(valuea)
      }
    } else if (predictionMap[FieldType.AMOUNT].length === 2) {
      const [fielda, fieldb] = predictionMap[FieldType.AMOUNT]

      let fieldaArray = []
      let fieldbArray = []
      let fieldaMean
      let fieldbMean
      let fieldaTotal = 0
      let fieldbTotal = 0

      // 2 columns
      if (fielda.predictions.positive + fieldb.predictions.positive === totalRecords) {
        for(let i in records) {
          let valuea = records[i][fielda.column]
          let valueb = records[i][fieldb.column]
          amounts[i] = parseAmount(valueb) || -parseAmount(valuea)
        }
      }
    }

    let fieldLengths = new Array(records[0].length).fill(0).map(_ => [])
    let fieldSets = new Array(records[0].length).fill(0).map(_ => new Set())

    for (let record of records) {
      record.forEach((val, i) => {
        fieldSets[i].add(val.replace(/\d/g, ''))
        fieldLengths[i].push(val.length)
      })
    }
    let fieldSetLengths = fieldSets.map(s => s.size)
    fieldLengths = fieldLengths.map(lengths => mean(lengths))

    console.log(fieldLengths)

    const dateFieldIndex = predictionMap[FieldType.DATE][0].column

    const descriptionIndex2 = fieldLengths.indexOf(Math.max(...fieldLengths))
    const descriptionIndex = fieldSetLengths.indexOf(Math.max(...fieldSetLengths))

    console.log('descrindex')    
    console.log(descriptionIndex)
    console.log(descriptionIndex2)
    console.log(fieldSets)
    console.log(fieldSetLengths)
   //    descrColumn = fieldLengths
   //

    // Detect column most likely to contain transaction date

    // if (predictions[i][0].fieldType === FieldType.DATE) {
    //   dateFieldIndex = i
    // }

    // TODO: detect column(s) most likely to contain credit and debit

    // TODO: create column most likely to contain description
    console.log('!!!!!!!FILENAME ' + filename)
    try {
      const import_sql = 'INSERT INTO imports (filename) VALUES (?)'
      const resa = await this.db.run(import_sql, [filename])
      console.log('HELLO!')
      console.log(resa)
      const import_id = resa.lastID

      const transaction_sql = 'INSERT INTO transactions (import_id, hash, row, date, amount, description, account) VALUES (?, ?, ?, ?, ?, ?, ?)'
      Promise.all(records.map((record, i) => {
        // Date field
        const dateFormat = predictionMap[FieldType.DATE][0].predictions[0]
        const dateRaw = record[dateFieldIndex]
        const dateValue = parseDate(dateRaw, dateFormat)

        // Amount field
        const amountValue = amounts[i]

        // Description field
        const descriptionValue = record[descriptionIndex]
        const row = record.join('|')
        return this.db.run(transaction_sql, [import_id, hash(row), row, dateValue, amountValue, descriptionValue, 'Fake'])
      }))
    } catch (ex) {
      console.log('excp')
      console.error(ex)
    }

    return true
  }

  async process(rawData) {
    const sql = 'INSERT INTO transactions (hash, row, date, account) VALUES (?, ?, ?, ?)'
    return await Promise.all(rawData.split(`\n`).map(row => {
      return this.db.run(sql, [hash(row), row, new Date(), 'Fake'])
    }))
  }

  async insert(records) {
    const sql = 'INSERT INTO transactions (hash, row, date, account, description, credit, debit) VALUES (?,?,?,?,?,?,?)'

    for (const record of records) {
      await this.db.run(sql, parseRow(record))
    }
  }

  async deleteAll() {
    return this.db.run('DELETE FROM imports')
  }

}

