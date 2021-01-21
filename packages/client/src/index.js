import { html, define, property, store } from 'hybrids'

import { Sidebar } from './components'
import { Application } from './stores'
import routes from './routes'

import label from './i18n/labels'
import style from 'bundle-text:./style.css'

function handleNavigation(host, event) {
  const nextPage = event.detail
  history.pushState(null, null, `#${nextPage}`)
  host.currentPage = nextPage
  host.menuVisible = false
}

function handleDismissError(index) {
  return host => {
    host.state = {
      ...host.state,
      errors: host.state.errors.filter((_, i) => i !== index),
    }
  }
}

export const AppMain = {
  menuVisible: false,
  state: store(Application),
  currentPage: {
    connect: (host, key) => {
      if (window.location.hash.startsWith('#')) {
        host.currentPage = window.location.hash.slice(1)
      } else {
        host[key] = Object.keys(host.routes)[0]
      }
      window.addEventListener('popstate', event => {
        host.currentPage = window.location.hash.slice(1)
      })
    },
  },
  routes: () => routes,
  render: ({ currentPage, menuVisible, routes, state }) =>
    html`
      <div class="flex h-screen bg-grey-100">
        <!-- Sidebar -->
        <div
          class="shadow fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 ${menuVisible
            ? ''
            : '-translate-x-full'} ease-in"
        >
          <div
            class="text-center border-t border-b block border-gray-700 m-6 p2 text-gray-500 text-xl tracking-widest"
          >
            ${label.app_title()}
          </div>
          <app-nav
            routes=${routes}
            current=${currentPage}
            onnavigate=${handleNavigation}
          ></app-nav>
        </div>

        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Page Heading -->
          <div class="flex items-center p-4 bg-white border-b border-gray-200">
            <div
              class="h-6 w-6 text-white inline-block mr-4 p-1 rounded-md box-content ${routes[
                currentPage
              ].classes.backgroundColor}"
            >
              ${routes[currentPage].icon}
            </div>
            <div class="text-gray-500 text-xl font-thin">
              ${routes[currentPage].title}
            </div>
            <div class="flex-grow"></div>
            <div
              class="h-6 w-6 cursor-pointer lg:hidden"
              onclick=${html.set('menuVisible', !menuVisible)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          </div>

          <!-- Main -->
          <div
            class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100"
          >
            <div class="p-4">
              <!-- Error Messages -->
              ${state.errors
                .filter(error => error.message)
                .map(
                  ({ message }, i) => html`
                    <div
                      class="bg-red-100 border-l-4 border-red-500 p-4 mb-4 shadow flex"
                    >
                      <div class="flex-1 pr-4">${message}</div>
                      <div
                        class="h-4 w-4 cursor-pointer text-red-600 hover:text-red-900"
                        onclick=${handleDismissError(i)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  `
                )}

              <!-- Page Content -->
              ${routes[currentPage].pageComponent}
            </div>
          </div>
        </div>
      </div>
    `.style(style),
}

define('app-nav', Sidebar)
define('app-main', AppMain)
