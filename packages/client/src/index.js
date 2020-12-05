import { html, define, property } from 'hybrids';
import style from 'bundle-text:./style.css'

import Table from './components/table.js'

export const AppMain = {
  data1: 'hello',
  data2: property('', (host, key) => {
    host[key] = 'world'
  }),
  render: ({ data1, data2 }) => html`
    <div class="bg-green-200"><b>${data1}</b> ${data2}</div>
    <app-table></app-table>SD
  `.style(style)
}

define('app-table', Table)
define('app-main', AppMain)