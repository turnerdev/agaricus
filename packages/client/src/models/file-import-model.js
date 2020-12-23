import { store } from 'hybrids'
import { getImports } from '../api/'

export const UploadingFileImport = {
  id: true,
  filename: ''
}

const FileImport = {
  id: true,
  filename: '',
  [store.connect] : {
    set: async (id, values, keys) => { throw 'Not implemented' },
    list: async () => {
      const result = await getImports()
      store.clear(UploadingFileImport, true)
      return result
    }
  },
}

export default FileImport