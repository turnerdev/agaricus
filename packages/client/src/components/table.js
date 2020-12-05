import { html, property } from 'hybrids'
import style from 'bundle-text:../style.css'

export default {
  data: property([], async (host, key) => {
    host[key] = await(await fetch('/api/transactions')).json()
  }),
  render: ({ data }) => html`
    <table class="border-collapse bg-green-100 border border-green-200">
      <thead>
        <tr>
        ${data && Object.keys(data[0]).map(field => html`
          <th class="border border-green-200 px-4 py-2">${field}</th>
        `)}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => html`
        <tr>
          ${Object.keys(row).map(field => html`
            <td class="border border-green-200 px-4 py-2">${row[field]}</td>
          `)}
        </tr>
        `)}
      </tbody>
    </table>
  `.style(style)
}