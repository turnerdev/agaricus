import { store } from 'hybrids'
import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api'

const Category = {
  id: true,
  name: '',
  color: '',
  [store.connect]: {
    get: getCategory,
    set: async (id, values, _) => {
      if (values === null) {
        await deleteCategory(id)
      } else if (isNaN(values.id)) {
        // New, unsaved records will have an alphanumeric GUID
        const record = (({ id, ...props }) => props)(values)
        await createCategory(record)
      } else {
        await updateCategory(values)
        return values
      }
      return null
    },
    list: getCategories,
  },
}

export default Category
