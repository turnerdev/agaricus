import { html } from 'hybrids'
import style from 'bundle-text:../../style.css'

// Use explicit colour names that can be recognised by tailwind purger
const bgColors = [
  'bg-category-0',
  'bg-category-1',
  'bg-category-2',
  'bg-category-3',
  'bg-category-4',
]

export default {
  color: 0,
  render: ({ color }) =>
    html`
      <div class="rounded-sm ${bgColors[color]}">
        <slot></slot>
      </div>
    `.style(style),
}
