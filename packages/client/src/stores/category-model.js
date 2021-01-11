import { store } from 'hybrids'
import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../api/categories-api.js'

const Category = {
  id: true,
  name: '',
  row_number: 0,
  [store.connect]: {
    get: getCategory,
    set: async (id, values, keys) =>

      if (values === null) {
        await deleteAccount(id)
        return null
      } else if (isNaN(values.id)) {
        const record = (({ id, ...props }) => props)(nValues)
        await createAccount(record)
        return null
      } else {
        await updateAccount(nValues)
        return values
      }
      createCategory({
        name: values.name,
      }),
    list: getCategories,
  },
}

