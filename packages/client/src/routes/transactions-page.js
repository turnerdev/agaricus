import { define, html, property, store } from 'hybrids'

import label from '../i18n/labels'
import { TransactionList, Transaction } from '../stores'
import {
  Button,
  Modal,
  CategoryPicker,
  CategoryManager,
  PagerFooter,
  TransactionEntry,
} from '../components'

import style from 'bundle-text:../style.css'

const CTRL_KEYS = ['ControlLeft', 'ControlRight']
const SHIFT_KEYS = ['ShiftLeft', 'ShiftRight']
const SEARCH_DELAY = 300

const modals = Object.freeze({
  NONE: Symbol('MODALS_NONE'),
  CATEGORY_MANAGE: Symbol('MODALS_CATEGORY_MANAGER'),
})

function ctrlKeyDown(host) {
  return CTRL_KEYS.filter(key => host.keysdown.has(key)).length > 0
}

function handleSearch(host, event) {
  const query = event.target.value
  clearTimeout(host.searchDelay)
  host.searchDelay = setTimeout(() => {
    host.page = 1
    host.query = query
  }, SEARCH_DELAY)
}

function handleChangePage(host, event) {
  host.page = event.detail
}

function handleKeyDown(host, event) {
  host.keysdown.add(event.code)
  host.keysdown = new Set(host.keysdown)
}

function handleKeyUp(host, event) {
  host.keysdown.delete(event.code)
  host.keysdown = new Set(host.keysdown)
}

/**
 * Handle mousedown event to initate selecting a block of transactions
 * @param {*} host
 * @param {*} event
 */
function handleMouseDown(host, event) {
  const recordId = event.target.dataset.id
  if (!recordId && !host.mousedown) {
    host.selected = new Set()
    host.coords = null
    return
  } else if (recordId) {
    host.mousedown = recordId
    if (ctrlKeyDown(host)) {
      if (host.selected.has(recordId)) {
        host.selected.delete(recordId)
      } else {
        host.selected.add(recordId)
      }
      host.selected = new Set(host.selected)
    } else {
      host.selected = new Set([recordId])
    }
  }
}

/**
 * Handle mouse drag to select multiple transactions
 * @param {*} host
 * @param {*} event
 */
function handleMouseMove(host, event) {
  const recordId = event.target.dataset.id
  if (
    host.mousedown &&
    host.mousedown !== recordId &&
    store.ready(host.searchResults)
  ) {
    const start = host.searchResults.items.findIndex(
      item => item.id === host.mousedown
    )
    const end = host.searchResults.items.findIndex(item => item.id === recordId)
    const selectedSet = ctrlKeyDown(host) ? new Set(host.selected) : new Set()

    if (start >= 0 && end >= 0) {
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
        selectedSet.add(host.searchResults.items[i].id)
      }
      host.selected = selectedSet
    }
  }
}

/**
 * Handle mouse release and set display coordinates for category picker
 * @param {*} host
 * @param {*} event
 */
function handleMouseUp(host, event) {
  if (host.selected.size > 0 && host.mousedown) {
    host.coords = [event.clientX, event.clientY]
  }
  host.mousedown = ''
}

async function handleCategoryPick(host, event) {
  host.coords = null
  host.selected.forEach(async transactionId => {
    const record = await store.get(Transaction, transactionId)
    await store.set(record, { category_id: event.detail })
  })
}

function handleHideModal(host) {
  host.modal = modals.NONE
}

const categoryModalContent = ({}) => html`
  <app-category-manager slot="body"></app-category-manager>
  <div class="flex space-x-2 w-full" slot="footer">
    <div class="flex-grow"></div>
    <app-button onclick=${handleHideModal} class="flex-none">
      ${label.close()}
    </app-button>
  </div>
`

export default {
  query: '',
  page: 1,
  perPage: 10,
  coords: property(),
  searchDelay: property(),
  searchResults: store(TransactionList, ({ query, page, perPage }) => ({
    query,
    page,
    perPage,
  })),
  selected: {
    connect: (host, key) => {
      host[key] = new Set()
    },
  },
  keysdown: property(new Set()),
  mousedown: '',
  events: {
    connect: host => {
      const eventHandlers = {
        mousedown: handleMouseDown.bind(undefined, host),
        mouseup: handleMouseUp.bind(undefined, host),
        keydown: handleKeyDown.bind(undefined, host),
        keyup: handleKeyUp.bind(undefined, host),
      }
      Object.keys(eventHandlers).forEach(event => {
        document.addEventListener(event, eventHandlers[event])
      })
      return () => {
        Object.keys(eventHandlers).forEach(event =>
          document.removeEventListener(event, eventHandlers[event])
        )
      }
    },
  },
  modal: modals.NONE,
  render: ({ coords, searchResults, modal, page, perPage, selected }) =>
    html`${coords &&
      html`
        <app-category-picker
          x=${coords[0]}
          y=${coords[1]}
          onpick=${handleCategoryPick}
        ></app-category-picker>
      `.style(style)}

      <app-modal visible=${modal !== modals.NONE} onhide=${handleHideModal}>
        ${modal === modals.CATEGORY_MANAGE && categoryModalContent({})}
      </app-modal>

      <div class="flex flex-col space-y-4">
        <div class="bg-white shadow">
          <div class="flex">
            <div class="p-4 w-1/2">
              <div class="border border-gray-2/00 px-2 flex flex-shrink">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-6 w-6 text-gray-400 self-center mr-2 flex-shrink-0"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  class="flex-shrink flex-1 w-1/2 py-2 text-sm"
                  oninput="${handleSearch}"
                />
              </div>
            </div>
            <div class="w-1/2 p-4 flex content-end justify-end space-x-2">
              <app-button onclick=${html.set('modal', modals.CATEGORY_MANAGE)}>
                ${label.categories_more()}
              </app-button>
            </div>
          </div>
          ${store.ready(searchResults) &&
          searchResults.items.map(record =>
            html`
              <app-transaction-entry
                data-id=${record.id}
                recordid=${record.id}
                selected="${selected.has(record.id)}"
                onmousemove=${handleMouseMove}
                onmousedown=${handleMouseDown}
              >
              </app-transaction-entry>
            `.key(record.id)
          )}
          ${store.ready(searchResults) &&
          html`
            <app-pager-footer
              page="${page}"
              perPage="${perPage}"
              total="${searchResults.count}"
              onchange-page=${handleChangePage}
            >
            </app-pager-footer>
          `}
        </div>
      </div>`.style(style),
}

define('app-button', Button)
define('app-modal', Modal)
define('app-category-manager', CategoryManager)
define('app-category-picker', CategoryPicker)
define('app-pager-footer', PagerFooter)
define('app-transaction-entry', TransactionEntry)
