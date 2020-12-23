import { html, store } from 'hybrids'
import style from 'bundle-text:../style.css'

import Category from '../models/category-model'

import { getCategoryColor } from './categories' 

const getColor = (value) => value < 0 ? 'text-red-500' : ''

const formatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'USD', // TODO record currency
})

export default {
  category: (host) => host.record.category_id && store.get(Category, host.record.category_id),
  selected: false,
  record: {},
  render: ({ category, selected, record }) => html`
    <div class="grid grid-cols-6 gap-4 border-t border-gray-200 px-4 py-2 md:auto-cols-auto select-none ${ selected ? 'bg-primary-100' : 'hover:bg-gray-50'}">
      <div class="col-span-4 overflow-hidden">
        <div class="text-gray-600 text-xs">${record.dateString}</div>
        <div class="whitespace-nowrap overflow-x-hidden overflow-ellipsis">${record.description}</div>
      </div>
      <div class="flex items-center">
        ${category && store.ready(category) ? html`
          <div class="${getCategoryColor(category.row_number)} inline-block text-white rounded-full text-xs font-bold  px-2 py-1 select-none cursor-pointer">
            ${category.name}
          </div>
        `:html`
          <div class="inline-block text-gray-400 rounded-full text-xs font-bold mr-4 border-2 border-gray-200 px-2 py-1">Uncategorized</div>
        `}
      </div>
      <div class="col-span-1 text-xl text-right">
        <div class="inline-block align-middle ${getColor(record.amount)}">${formatter.format(record.amount)}</div>
      </div>
    </div>
  `.style(style)
}