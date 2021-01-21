import { html } from 'hybrids'

import style from 'bundle-text:../../style.css'

function autofocus(host) {
  host.querySelector('input')?.focus()
}

export default {
  x: 0,
  y: 0,
  render: ({ x, y }) =>
    html`
      <div
        onmousedown=${(host, event) => event.stopPropagation()}
        style="left: ${x}px; top: ${y}px"
        class="bg-white shadow absolute w-72"
      >
        <div class="m-2 relative">
          <slot></slot>
          ${host => autofocus(host)}
        </div>
      </div>
    `.style(style),
}
