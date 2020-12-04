import { html, define, property } from 'hybrids';
import style from 'bundle-text:./style.css'

export const AppMain = {
  data1: 'hello',
  data2: property('', (host, key) => {
    host[key] = 'world'
  }),
  render: ({ data1, data2 }) => html`
    <div class="bg-green-200"><b>${data1}</b> ${data2}</div>
  `.style(style)
}

define('app-main', AppMain)