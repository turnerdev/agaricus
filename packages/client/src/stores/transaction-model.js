import { property, store } from 'hybrids'
import {
  getTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transactions-api.js'

import Category from './category-model'

const readonly = {
  category: ({ category_id }) =>
    category_id > 0 && store.get(Category, category_id),
}

const Transaction = {
  id: true,
  hash: '',
  date: '',
  dateString: ({ date }) => new Date(Number(date)).toDateString(),
  amount: 0,
  description: '',
  row: '',
  message: '',
  account_id: -1,
  category_id: -1,
  // category: store(Category, { id: 'category_id' }),
  ...readonly,
  [store.connect]: {
    get: getTransaction,
    set: async (id, values, keys) => {
      if (!isNaN(id)) {
        updateTransaction(
          keys.reduce(
            (a, c) => ({
              ...a,
              [c]: values[c],
            }),
            { id }
          )
        )
      }

      return null
    },
    // list: getTransactions
  },
}

export default Transaction
