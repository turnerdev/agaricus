import { define, dispatch, html, property, store } from 'hybrids'
import style from 'bundle-text:../style.css'

import { TransactionList } from '../models'
import PagerFooter from './pager-footer'
import Transaction from './transaction'


const ctrlKeys = ['ControlLeft', 'ControlRight']
const shiftKeys = ['ShiftLeft', 'ShiftRight']

function ctrlKeyDown(host) {
  return ctrlKeys.filter(key => host.keysdown.has(key)).length > 0
}

function handleSearch(host, event) {
  host.page = 1
  host.query = event.target.value
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

function handleMouseDown(host, event) {
  const recordId = event.target.dataset.id
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

function handleMouseUp(host, event) {
  host.mousedown = ''
}

function handleMouseMove(host, event) {
  const recordId = event.target.dataset.id
  if (host.mousedown && host.mousedown !== recordId && store.ready(host.searchResults)) {
    const start = host.searchResults.items.findIndex(item => item.id === host.mousedown)
    const end = host.searchResults.items.findIndex(item => item.id === recordId)
    const selectedSet = ctrlKeyDown(host) ? new Set(host.selected) : new Set()

    if (start >= 0 && end >= 0) {
      for (let i=Math.min(start,end); i<=Math.max(start, end); i++) {
        selectedSet.add(host.searchResults.items[i].id)
      }
      host.selected = selectedSet
    }
  }
}

export default {
  query: "",
  page: 1,
  perPage: 10,
  searchResults: store(TransactionList, ({ query, page, perPage }) => {
    return { query, page, perPage };
  }),
  selected: {
    connect: (host, key) => {
      host[key] = new Set()
    },
    observe: (host, value, lastValue) => {
      dispatch(host, 'select', { detail: value })
    }
  },
  keysdown: property(new Set()),
  mousedown: "",
  events: {
    connect: host => {
      // Add document-level event listeners
      // document.addEventListener('mousemove', handleMouseMove.bind(undefined, host));
      document.addEventListener('mouseup', handleMouseUp.bind(undefined, host));
      document.addEventListener('keyup', handleKeyUp.bind(undefined, host));
      document.addEventListener('keydown', handleKeyDown.bind(undefined, host));
      return () => {
        // Remove document-level event listeners
        // document.removeEventListener('mousemove', handleMouseMove.bind(undefined, host));
        document.removeEventListener('mouseup', handleMouseUp.bind(undefined, host));
        document.removeEventListener('keyup', handleKeyUp.bind(undefined, host));
        document.removeEventListener('keydown', handleKeyDown.bind(undefined, host));
      }
    }
  },
  render: ({ searchResults, page, perPage, selected }) => html`
    <div class="p-4">
      <div class="border border-gray-200 px-2 flex flex-shrink">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 text-gray-400 self-center mr-2 flex-shrink-0">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input type="text"
          placeholder="Search transactions..."
          class="flex-shrink flex-1 w-1/2 py-2"
          oninput="${handleSearch}"/>
      </div>
    </div>
    ${store.ready(searchResults) && searchResults.items.map(record => html`
      <app-transaction-entry
        data-id=${record.id} 
        record=${record}
        selected="${selected.has(record.id)}"
        onmousemove=${handleMouseMove}
        onmousedown=${handleMouseDown}>
    </app-transaction-entry>
    `.key(record.id))}
    ${store.ready(searchResults) && html `
      <app-pager-footer
        page="${page}"
        perPage="${perPage}"
        total="${searchResults.count}"
        onchange-page=${handleChangePage}>
      </app-pager-footer>
    `}
  `.style(style)
}

define('app-pager-footer', PagerFooter)
define('app-transaction-entry', Transaction)