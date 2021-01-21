import { define, html, property, store } from 'hybrids'

import label from '../i18n/labels'
import { draftStoreFactory } from '../helpers/factories'
import { uploadFiles } from '../api'

import Account from '../stores/account-model'
import { Button, Modal, AccountForm, UploadForm } from '../components'

import style from 'bundle-text:../style.css'

// Enum for active modal
const modals = Object.freeze({
  NONE: Symbol('MODALS_NONE'),
  ACCOUNT_CREATE_EDIT: Symbol('MODALS_ACCOUNT_CREATE_EDIT'),
  UPLOAD: Symbol('MODALS_UPLOAD'),
})

function formatCurrency(value, currency) {
  const formatter = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency,
  })
  return formatter.format(value)
}

function handleHideModal(host) {
  host.modal = modals.NONE
  host.files = []
}

function handleNewAccount(host) {
  host.selectedId = null
  host.modal = modals.ACCOUNT_CREATE_EDIT
}

function handleEditAccount(id) {
  return async host => {
    host.selectedId = id
    host.modal = modals.ACCOUNT_CREATE_EDIT
  }
}

async function handleDeleteAccount(host) {
  host.account = null
  host.selectedId = null
  handleHideModal(host)
}

async function handleAccountSave(host) {
  await store.submit(host.account)
  handleHideModal(host)
}

function handleShowUploadModal(host) {
  host.modal = modals.UPLOAD
}

function handleSelectFiles(host, event) {
  host.files = event.detail.files
  host.selectedId = event.detail.account
}

async function handleUploadFiles(host) {
  await uploadFiles(host.selectedId, host.files)
  await store.clear([Account])
  handleHideModal(host)
}

const accountModalContent = ({ account }) => html`
  ${store.error(account) &&
  html`<div slot="body" class="bg-red-300 border-l-4 border-red-600 p-4 mb-4">
    ${store.error(account)}
  </div>`}
  ${store.ready(account) &&
  html`<app-account-form
    slot="body"
    account=${account}
    onsubmit=${handleAccountSave}
  ></app-account-form>`}
  <div class="flex space-x-2 w-full" slot="footer">
    ${!isNaN(account.id) &&
    html`<app-button
      onclick=${handleDeleteAccount}
      variant="destructive"
      class="flex-none"
    >
      ${label.delete()}
    </app-button>`}
    <div class="flex-grow"></div>
    <app-button onclick=${handleHideModal} class="flex-none">
      ${label.cancel()}
    </app-button>
    <app-button
      variant="primary"
      onclick=${handleAccountSave}
      class="flex-none"
    >
      ${label.save()}
    </app-button>
  </div>
`

const uploadModalContent = ({ files }) => html` <app-upload-form
    slot="body"
    onfileselect=${handleSelectFiles}
  ></app-upload-form>
  <div class="flex space-x-2 w-full justify-end" slot="footer">
    <app-button onclick=${handleHideModal} class="flex-none">
      ${label.cancel()}
    </app-button>
    <app-button
      variant="${files.length > 0 ? 'primary' : 'disabled'}"
      onclick=${handleUploadFiles}
      class="flex-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5 fill-current mr-1 inline-block align-middle"
      >
        <path
          fill-rule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
      ${label.upload()}
    </app-button>
  </div>`

export default {
  modal: modals.NONE,
  selectedId: property(),
  files: [],
  account: draftStoreFactory(Account, 'selectedId'),
  accounts: store([Account]),
  render: ({ account, accounts, files, modal }) =>
    html` <app-modal
        visible="${modal !== modals.NONE}"
        onhide=${handleHideModal}
      >
        ${modal === modals.ACCOUNT_CREATE_EDIT &&
        accountModalContent({ account })}
        ${modal === modals.UPLOAD && uploadModalContent({ files })}
      </app-modal>
      <div class="flex flex-col space-y-4">
        <div class="bg-white shadow">
          ${store.ready(accounts) &&
          html`
            <div class="p-4 flex content-end justify-end space-x-2">
              <app-button
                onclick=${handleNewAccount}
                variant="${accounts.length === 0 ? 'primary' : 'default'}"
              >
                ${label.new_account()}
              </app-button>
              <app-button
                onclick=${handleShowUploadModal}
                variant="primary"
                class=${{ hidden: accounts.length === 0 }}
              >
                ${label.import_transactions()}
              </app-button>
            </div>
            <div class="divide-y border-t border-gray-100">
              ${accounts
                .filter(account => account)
                .map(account =>
                  html`
                    <div
                      onclick="${handleEditAccount(account.id)}"
                      class="grid grid-cols-5 px-4 py-2 gap-x-2 border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div class="col-span-2">${account.name}</div>
                      <div>${account.uploads}</div>
                      <div>${account.transactions}</div>
                      <div>
                        ${formatCurrency(account.total, account.currency)}
                      </div>
                    </div>
                  `.key(account.id)
                )}
            </div>
          `}
        </div>
      </div>`.style(style),
}

define('app-modal', Modal)
define('app-button', Button)
define('app-account-form', AccountForm)
define('app-upload-form', UploadForm)
