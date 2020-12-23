import { store } from 'hybrids'
import { getTransaction, getTransactions } from '../api/transactions-api.js'
import FileImport from './file-import-model'

const Transaction = {
  id: true,
  hash: '',
  date: '',
  dateString: ({ date }) => new Date(Number(date)).toDateString(),
  amount: 0,
  description: '',
  row: '',
  message: '',
  category_id: -1,
  [store.connect] : {
    get: getTransaction,
    set: async (id, values, keys) => {
      alert(JSON.stringify(keys))
    }
    // list: getTransactions
  },
}

export default Transaction