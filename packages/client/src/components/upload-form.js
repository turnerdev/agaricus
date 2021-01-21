import { dispatch, html, property, store } from 'hybrids'

import { Account } from '../stores'

import label from '../i18n/labels'
import style from 'bundle-text:../style.css'

async function handleSelectFiles(host, event) {
  host.files = [...event.target.files]
  dispatch(host, 'fileselect', {
    detail: {
      account: host.account,
      files: host.files,
    },
  })
}

export default {
  account: {
    connect: (host, key) => {
      host[key] = host.accounts[0].id
    },
  },
  accounts: store([Account]),
  files: [],
  render: ({ accounts, files }) =>
    html` <form class="w-full max-w-lg">
      <div class="flex flex-wrap -mx-3">
        <div class="w-full px-3 mb-6 md:mb-4">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            ${label.account_name()}
          </label>
          <div class="relative">
            <select
              onchange=${html.set('account')}
              class="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded focus:outline-none focus:border-gray-400"
              id="grid-state"
            >
              ${store.ready(accounts) &&
              accounts.map(
                ({ id, name }) => html` <option value="${id}">${name}</option> `
              )}
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="w-full px-3 mb-6 md:mb-0">
          <p>Select one or more files containing financial transactions</p>
          <p class="text-sm text-gray-500">
            Support file formats: CSV (comma-separated values), XLSX (microsoft
            excel)
          </p>
          <div class="flex mt-2 space-x-4 items-start">
            <label
              class="cursor-pointer flex justify-center bg-primary hover:bg-primary-500 text-white text-sm py-3 px-4 border border-primary rounded font-bold items-center focus:outline-none active:ring-2 active:ring-primary-200"
              for="fileselector"
            >
              Select files...
            </label>
            <input
              class="hidden"
              onchange=${handleSelectFiles}
              type="file"
              id="fileselector"
              multiple
            />
            <div class="flex flex-1 space-y-2 flex-col">
              ${files.map(({ name }) => html` <div>${name}</div> `)}
            </div>
          </div>
        </div>
      </div>
    </form>`.style(style),
}
