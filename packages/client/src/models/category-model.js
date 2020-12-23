import { store } from 'hybrids'
import { getCategories, addCategory } from '../api/categories-api.js'

const Category = {
  id: true,
  name: '',
  row_number: 0,
  [store.connect] : {
    set: async (id, values, keys) => addCategory({
      name: values.name
    }),
    list: getCategories
  },
}

export default Category