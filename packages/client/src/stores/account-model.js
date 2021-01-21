import { store } from 'hybrids'
import {
  getAccount,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../api'
import Preferences from './preferences'
import { omit } from '../helpers/utils'

// Read-only properties, omitted when setting
const readonly = {
  total: 0,
  uploads: 0,
  transactions: 0,
}

const Account = {
  id: true,
  name: '',
  currency: store.get(Preferences).currency,
  ...readonly,
  [store.connect]: {
    get: getAccount,
    set: async (id, values, _) => {
      const nValues = values && omit(values, Object.keys(readonly))

      if (values === null) {
        await deleteAccount(id)
      } else if (isNaN(values.id)) {
        const record = (({ id, ...props }) => props)(nValues)
        await createAccount(record)
      } else {
        await updateAccount(nValues)
        return values
      }

      return null
    },
    list: getAccounts,
  },
}

export default Account
