import { define, dispatch, html, property, store } from 'hybrids'

import { Category } from '../stores'
import ContextWindow from './base/context-window'

import style from 'bundle-text:../style.css'

function handleCategoryPick(category) {
  return host => {
    dispatch(host, 'pick', { detail: category.id })
  }
}

export default {
  categories: store([Category]),
  x: 0,
  y: 0,
  render: ({ categories, x, y }) =>
    categories.length === 0
      ? ''
      : html`
          <app-context-window x=${x} y=${y}>
            <div class="flex flex-row -mb-2 flex-wrap">
              ${categories.map(
                category => html`
                  <div
                    class="flex items-center mb-2 mr-2"
                    onclick=${handleCategoryPick(category)}
                  >
                    <span
                      style="background-color: ${category.color}"
                      class="block font-normal truncate text-sm rounded-md px-2 py-1 cursor-pointer select-none"
                    >
                      ${category.name}
                    </span>
                  </div>
                `
              )}
            </div>
          </app-context-window>
        `.style(style),
}

define('app-context-window', ContextWindow)
