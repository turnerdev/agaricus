import { dispatch, html, property } from 'hybrids'
import style from 'bundle-text:../style.css'

const classes = {
  default: ['flex','items-center','mt-4','py-2','px-6','text-gray-500','hover:bg-gray-700','hover:bg-opacity-25','hover:text-gray-100'],
  selected: ['flex','items-center','mt-4','py-2','px-6','bg-gray-700','bg-opacity-25','text-gray-100']
}

function handleClick(host, event) {
  dispatch(host, 'navigate', { detail: event.currentTarget.dataset.route })
}

export default {
  current: '',
  routes: property([]),
  render: ({ current, routes }) => html`
    <nav class="mt-10">
      ${Object.keys(routes).map(key => html`
        <a class=${current === key ? classes.selected : classes.default}
          onclick=${handleClick}
          data-route="${key}"
          href="javascript:void(0)">
          <div class="h-5 w-5">${routes[key].icon}</div>
          <span class="mx-3">${routes[key].title}</span>
        </a> 
      `)}
    </nav>`.style(style)
}