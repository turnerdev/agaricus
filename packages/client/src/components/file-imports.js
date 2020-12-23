import { define, html, store } from 'hybrids'
import style from 'bundle-text:../style.css'

import { FileImport, UploadingFileImport, Transaction }  from '../models/'
import { deleteTransactions } from '../api/'
import Upload from './upload.js'

function handleDeleteTransactions() {
  deleteTransactions()
  store.clear(Transaction, true)
  store.clear(FileImport, true)
}

export default {
  uploadingImports: store([UploadingFileImport]),
  imports: store([FileImport]),
  render: ({ imports, uploadingImports }) => html`
    <div class="bg-white rounded-md shadow">
      <div class="p-4 border-b border-gray-200 grid gap-2 grid-flow-col">
        <app-upload></app-upload>
        <app-button onclick=${handleDeleteTransactions}>Clear All</app-button>
      </div>
      <ul class="divide-solid divide-y divide-gray-200">
      ${store.ready(uploadingImports) && uploadingImports.map(item => html`
        <li class="select-none flex items-center text-gray-500 p-4">
          <svg class="flex-shrink-0 animate-spin -ml-1 mr-3 h-5 w-5 inline-block align-bottom" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="overflow-ellipsis overflow-hidden flex-shrink">
            ${item.filename}
          </div>
        </li>
      `)}
      ${store.ready(imports) && imports.map(item => html`
        <li class="select-none flex items-center cursor-pointer hover:bg-gray-100 p-4">
          <span class="overflow-ellipsis overflow-hidden flex-shrink">
            ${item.filename}
          </div>
        </li>
      `.key(item.id))}
      </ul>
    </div>`.style(style)
}

define('app-upload', Upload)