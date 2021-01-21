import { html, dispatch, store } from 'hybrids'
import style from 'bundle-text:../style.css'
import Category from '../stores/category-model'

function handleKeyDown(host, event) {
  if (event.code === 'Enter') {
    store.set(Category, { name: event.target.value })
    event.target.value = ''
    store.clear(Category, true)
  }
}

function handleClick(host, event) {
  dispatch(host, 'select', { detail: event.target.dataset.id })
}

export function getCategoryColor(id) {
  return `bg-category-${id%5}`
}

export default {
  categories: store([Category]),
  render: ({ categories }) => html`
    <input class="border border-gray-200 px-4 py-2 mb-4"
      onkeydown=${handleKeyDown}
      type="text" placeholder="Add category..."/>
    ${store.ready(categories) && categories.map(category => html`
      <div class="${getCategoryColor(category.row_number)} inline-block text-white rounded-full text-xs font-bold mr-2 mb-4  px-2 py-1 select-none cursor-pointer"
           data-id=${category.id}
           onclick=${handleClick}>
        ${category.name}
      </div>
    `)}
  `.style(style)
}
