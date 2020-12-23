import { store } from 'hybrids'
import { getTransaction, getTransactions } from '../api/'
import { Transaction } from './' 

const TransactionList = {
  id: true,
  items: [Transaction, { loose: true }],
  count: 0,
  page: 0,
  perPage: 0,
  [store.connect]: getTransactions
}

export default TransactionList