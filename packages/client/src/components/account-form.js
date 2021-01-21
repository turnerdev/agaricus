import { dispatch, html, property } from 'hybrids'

import label from '../i18n/labels'
import { autofocus } from '../helpers/utils'
import style from 'bundle-text:../style.css'

// TODO: Use store values
const currencies = ['CAD', 'USD', 'GBP']

function handleSubmit(host, event) {
  dispatch(host, 'submit')
  event.preventDefault()
}

export default {
  account: property(),
  render: ({ account }) =>
    html`
      ${host => autofocus(host)}
      <form class="w-full max-w-lg" onsubmit="${handleSubmit}">
        <div class="flex flex-wrap -mx-3">
          <div class="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              ${label.account_name()}
            </label>
            <input
              onchange=${html.set(account, 'name')}
              value=${account.name}
              class="appearance-none block w-full bg-white text-gray-700 border border-ray-200 rounded py-3 px-4 mb-3 focus:outline-none focus:border-gray-400"
              id="grid-first-name"
              type="text"
              placeholder="Account name"
            />
            <p class="text-red-500 text-xs italic hidden">
              Please fill out this field.
            </p>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-state"
            >
              ${label.currency()}
            </label>
            <div class="relative">
              <select
                onchange=${html.set(account, 'currency')}
                class="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded focus:outline-none focus:border-gray-400"
                id="grid-state"
              >
                ${currencies.map(
                  currency => html`
                    <option
                      selected="${currency === account.currency
                        ? 'selected'
                        : ''}"
                    >
                      ${currency}
                    </option>
                  `
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
        </div>
      </form>
    `.style(style),
}
