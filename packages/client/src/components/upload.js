import { html, store } from 'hybrids'
import style from 'bundle-text:../style.css'

import { uploadFiles } from '../api/'
import { Transaction, FileImport, UploadingFileImport } from '../models/'

async function handleSelectFiles(host, event) {
  host.files = [...event.target.files]
  host.files.forEach((file, i) => store.set(UploadingFileImport, {
    filename: file.name
  }))
  await uploadFiles(host.files)
  store.clear(Transaction, true)
  store.clear(FileImport, true)
}

export default {
  files: [],
  render: () => html`
    <label class="cursor-pointer flex justify-center bg-primary hover:bg-primary-500 text-white text-sm py-3 px-4 border border-primary rounded font-bold items-center focus:outline-none active:ring-2 active:ring-primary-200" for="fileselector">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 fill-current mr-1 inline-block align-middle">
        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
      Upload
    </label>
    <input class="hidden" onchange=${handleSelectFiles} type="file" id="fileselector" multiple>
  `.style(style)
}