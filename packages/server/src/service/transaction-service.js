import crypto from 'crypto'
import { hasHeaderRows, predictDateFormat, predictAmountFormat, parseDate, parseAmount } from '../utils/heuristics.js'
import parse from 'csv-parse/lib/sync.js'
import { mean } from '../utils/statistics.js'

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
async function analyzeRows(records) {
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

export default class TransactionService {
  constructor({ transactionRepository, uploadRepository, accountRepository }) {
    this.transactionRepository = transactionRepository
    this.uploadRepository = uploadRepository
    this.accountRepository = accountRepository
  }

  async getTransaction(id) {
    return this.transactionRepository.get(id)
  }

  async findTransactions(parameters) {
    return this.transactionRepository.find(parameters)
  }

  async createFromFile(file) {
    switch (file.mimetype) {
      case 'text/csv':
        const data = (await file.toBuffer()).toString()
        if (data.length > 0) {
          return this.createFromCsv(file.filename, data)
        }
      default:
        throw 'Invalid file type'
    }
  }

  async createFromCsv(name, rawData) {
    try{
      const data = parse(rawData, { skip_empty_lines: true })
      const records = await processRawData(data)
      const upload = await this.uploadRepository.set({ name })
      const account = await this.accountRepository.set({
        name: 'Account name',
        currency: 'CAD'
      })

      records.forEach(record => {
        record.upload_id = upload[0],
        record.account_id = account[0]
      })

      const transactions = await this.transactionRepository.set(records)
      
      console.log('!!!!!!!!!!!11')
      return transactions
    } catch(ex) {
      console.log('EXCEPTION', ex)
    }
  }

  async createFromXslx(filename, data) {
   throw 'Not implemented' 
  }

}


async function processRawData(data) {
  // Detect header rows
  const headerRows = hasHeaderRows(data.map(datum => datum.join('')))
  const rows = data.slice(headerRows)

  // Predict column formats
  const predictions = await analyzeRows(rows)
  const predictionBuckets = {
    [FieldType.DATE]: [],
    [FieldType.DESCRIPTION]: [],
    [FieldType.AMOUNT]: []
  }

  // Compile predictions
  console.log('Compiling predictions')
  for (let i=0; i<predictions.length; i++) {
    if (predictions[i].length > 0) {
      const prediction = predictions[i][0];
      predictionBuckets[prediction.fieldType].push({
        column: i,
        predictions: prediction.predictions
      })
    } 
  }

  // TOOD: Get earliest of date fields
  if (predictionBuckets[FieldType.DATE].length > 1) {
    const potentialDateFields = predictionBuckets[FieldType.DATE]
    const minCount = new Array(potentialDateFields.length).fill(0)
    for (let record of rows) {
        // TODO: Not implemented
    }
  }

  const totalRecords = rows.length
  let amounts = new Array(totalRecords).fill(0)
  
  if (predictionBuckets[FieldType.AMOUNT].length === 1) {
    let column = predictionBuckets[FieldType.AMOUNT][0].column
    for(let i in rows) {
      let valuea = rows[i][column]
      amounts[i] = parseAmount(valuea)
    }
  } else if (predictionBuckets[FieldType.AMOUNT].length === 2) {
    const [fielda, fieldb] = predictionBuckets[FieldType.AMOUNT]

    // 2 columns
    if (fielda.predictions.positive + fieldb.predictions.positive === totalRecords) {
      for(let i in rows) {
        let valuea = rows[i][fielda.column]
        let valueb = rows[i][fieldb.column]
        amounts[i] = parseAmount(valueb) || -parseAmount(valuea)
      }
    }
  } else {
    throw 'Ambiguous prediction: More than 2 predictions for Amount'
  }

  let fieldLengths = new Array(rows[0].length).fill(0).map(_ => [])
  let fieldSets = new Array(rows[0].length).fill(0).map(_ => new Set())

  for (let row of rows) {
    row.forEach((val, i) => {
      fieldSets[i].add(val.replace(/\d/g, ''))
      fieldLengths[i].push(val.length)
    })
  }
  let fieldSetLengths = fieldSets.map(s => s.size)
  fieldLengths = fieldLengths.map(lengths => mean(lengths))

  const dateFieldIndex = predictionBuckets[FieldType.DATE][0].column
  // const descriptionIndex2 = fieldLengths.indexOf(Math.max(...fieldLengths))
  const descriptionIndex = fieldSetLengths.indexOf(Math.max(...fieldSetLengths))

  return rows.map((row, i) => {
    const dateFormat = predictionBuckets[FieldType.DATE][0].predictions[0]
    return {
      date: parseDate(row[dateFieldIndex], dateFormat),
      amount: amounts[i],
      description: row[descriptionIndex],
      row: row.join('|')
    }
  })

    // const import_sql = 'INSERT INTO imports (filename) VALUES (?)'
    // const resa = await this.db.run(import_sql, [filename])
    // console.log('HELLO!')
    // console.log(resa)
    // const import_id = resa.lastID

    // const transaction_sql = 'INSERT INTO transactions (import_id, hash, row, date, amount, description, account) VALUES (?, ?, ?, ?, ?, ?, ?)'
    // Promise.all(rows.map((record, i) => {
    //   // Date field
    //   const dateFormat = predictionBuckets[FieldType.DATE][0].predictions[0]
    //   const dateRaw = record[dateFieldIndex]
    //   const dateValue = parseDate(dateRaw, dateFormat)

    //   // Amount field
    //   const amountValue = amounts[i]

    //   // Description field
    //   const descriptionValue = record[descriptionIndex]
    //   const row = record.join('|')
    //   return this.db.run(transaction_sql, [import_id, hash(row), row, dateValue, amountValue, descriptionValue, 'Fake'])
    // }))

}