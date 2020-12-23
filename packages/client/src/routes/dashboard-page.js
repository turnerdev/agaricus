import { html } from 'hybrids'
import style from 'bundle-text:../style.css'

export default {
  render: () => html`
  Inside the dashboards page
  `.style(style)
}
              // <div class="grid grid-cols-4 gap-4">
              //   <app-transactions onselect=${handleTransactionSelect} class="bg-white rounded-md shadow col-span-3"></app-transactions>
              //   <div class="grid grid-cols-1 gap-4 place-content-start">
              //     <app-categories onselect=${handleCategorySelect} class="shadow bg-white p-4 rounded-md"></app-categories>
              //     <app-file-imports></app-file-imports>
              //   </div>
              // </div>