import { html, define } from 'hybrids'
import style from 'bundle-text:../style.css'

import Pager from './pager'

export default {
  page: 0,
  perPage: 0,
  total: 0,
  render: ({ page, perPage, total }) => html`
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">${(page-1)*perPage+1}</span>
            to
            <span class="font-medium">${Math.min(page*perPage, total)}</span>
            of
            <span class="font-medium">${total}</span>
            results
          </p>
        </div>
        <app-pager currentPage="${page}" pages="${Math.ceil(total/perPage)}" neighbourhood="2"></app-pager>
      </div>
    </div>
  `.style(style)
}

define('app-pager', Pager)