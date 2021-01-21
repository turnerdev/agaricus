import { define, html, store } from 'hybrids'

import { autofocus } from '../helpers/utils'
import { Category } from '../stores'
import Button from './base/button'

import label from '../i18n/labels'
import style from 'bundle-text:../style.css'
import tailwind from '~/tailwind.config'

/**
 * Returns a random color defined from Tailwind config
 */
function getColor(host) {
  const available = Object.values(tailwind.theme.colors.category)
  return available[Math.floor(Math.random() * available.length)]
}

async function handleNewCategory(host, event) {
  const color = getColor(host)
  await store.set(host.newCategory, { color })
  await store.submit(host.newCategory)
  host.newCategory = null
  store.clear(host.categories)
  autofocus(host)
  event.preventDefault()
}

function handleDeleteCategory(category) {
  return () => {
    store.set(category, null)
  }
}

export default {
  newCategory: store(Category, { draft: true }),
  categories: store([Category]),
  render: ({ categories, newCategory }) =>
    html`
      <div class="flex py-1">
        <form class="flex-grow" onsubmit=${handleNewCategory}>
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            ${label.new_category()}
          </label>
          <input
            placeholder="${label.new_category()}"
            value=${newCategory.name}
            oninput=${html.set(newCategory, 'name')}
            class="appearance-none block w-full bg-white text-gray-700 border border-ray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:border-gray-400"
          />
        </form>
      </div>
      <div class="divide-y border-gray-200 border">
        ${store.ready(categories) &&
        categories.map(
          category => html`
            <div class="flex py-2 px-2">
              <div class="flex-shrink items-center flex pr-2">
                <input
                  class="flex h-6 w-6 cursor-pointer"
                  type="color"
                  value="${category.color}"
                  onchange=${html.set(category, 'color')}
                />
              </div>
              <div class="flex-grow flex items-center">
                <input
                  type="text"
                  value=${category.name}
                  onchange=${html.set(category, 'name')}
                />
              </div>
              <div
                class="flex-shrink items-center flex text-gray-400 hover:text-gray-600 cursor-pointer"
                onclick=${handleDeleteCategory(category)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  class="h-4 w-4"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          `
        )}
      </div>
      ${host => autofocus(host)}
    `.style(style),
}

define('app-button', Button)
