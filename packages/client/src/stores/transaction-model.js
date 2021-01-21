import { store } from 'hybrids'
import { getTransaction, updateTransaction } from '../api/transactions-api.js'

import Category from './category-model'

const readonly = {
  category: ({ category_id }) =>
    category_id > 0 && store.get(Category, category_id),
}

const Transaction = {
  id: true,
  hash: '',
  date: '',
  amount: 0,
  description: '',
  row: '',
  message: '',
  account_id: -1,
  category_id: -1,
  ...readonly,
  [store.connect]: {
    get: getTransaction,
    set: async (id, values, keys) => {
      // Unsaved records will have an alphanumeric GUID
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
  },
}

export default Transaction
