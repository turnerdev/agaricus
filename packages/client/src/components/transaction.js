import { define, html, property, store } from 'hybrids'
import style from 'bundle-text:../style.css'

import BasePill from './base/pill'

import Transaction from '../stores/transaction-model'

const getColor = value => (value < 0 ? 'text-red-500' : '')

const formatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'USD', // TODO use record currency
})

export default {
  selected: false,
  recordid: property(),
  record: store(Transaction, { id: 'recordid' }),
  render: ({ category, selected, record }) =>
    html`
      <div
        class="grid grid-cols-6 gap-4 border-t border-gray-200 px-4 py-2 md:auto-cols-auto select-none ${
          selected ? 'bg-primary-100' : 'hover:bg-gray-50'
        }"
      >
        <div class="col-span-4 overflow-hidden">
          <div class="text-gray-600 text-xs">${record.dateString}</div>
          <div class="whitespace-nowrap overflow-x-hidden overflow-ellipsis">
            ${record.description}
          </div>
        </div>
        <div class="flex items-center">
          ${
            store.ready(record.category)
              ? html`<div
                  title="${record.category?.name}"
                  style="background-color: ${record.category.color}"
                  class="rounded-md text-white text-sm px-2 py-1 overflow-ellipsis overflow-hidden whitespace-nowrap"
                >
                  ${record.category?.name}
                </div>`
              : html`<div class="text-sm text-gray-500">Unclassified</div>`
          }
          </div>
          <div class="col-span-1 text-xl text-right">
            <div class="inline-block align-middle ${getColor(record.amount)}">
              ${formatter.format(record.amount)}
            </div>
          </div>
        </div>
      </div>
    `.style(style),
}

define('base-pill', BasePill) // TODO: Use Base pill
