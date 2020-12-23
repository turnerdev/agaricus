import { html, define, property, store } from 'hybrids';
import style from 'bundle-text:./style.css'

import { Button, Categories, FileImport, Sidebar, Transactions } from './components/'
import { updateTransactions } from './api/transactions-api'
import Transaction from './models/transaction-model'
import TransactionList from './models/transaction-list-model'

import routes from './routes/'

function handleTransactionSelect(host, event) {
  host.selectedTransactions = event.detail
}

async function handleCategorySelect(host, event) {
  host.selectedTransactions.forEach(async (transactionId) => {
    const record = await store.get(Transaction, transactionId)
    store.set(record, {
      category_id: event.detail
    })
  }) 
}

async function handleNavigation(host, event) {
  const nextPage = event.detail
  history.pushState(null, null, `#${nextPage}`)
  host.currentPage = nextPage
}

export const AppMain = {
  currentPage: {
    connect: (host, key) => {
      host[key] = Object.keys(host.routes)[0]
      window.addEventListener('popstate', (event) => {
        console.log('state', event.state)
        host.currentPage = window.location.hash.slice(1)
      }, false);
    },
    observe: (host, value) => {

    }
  },
  routes: () => routes,
  selectedTransactions: property(new Set()),
  render: ({ currentPage, routes }) => html`
    <div class="flex h-screen bg-grey-100">
      <div class="shadow fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 -translate-x-full ease-in">
        <div class="text-center border-t border-b block border-gray-700 m-6 p2 text-gray-500 text-xl tracking-widest">
          AGARICUS
        </div>
        <app-nav routes=${routes} current=${currentPage} onnavigate=${handleNavigation}></app-nav>
      </div>
      
      <div class="flex-1 flex flex-col overflow-hidden">

        <div class="flex items-center p-4 bg-white border-b border-gray-200">
          <div class="h-6 w-6 text-white inline-block mr-4 p-1 rounded-md box-content ${routes[currentPage].classes.backgroundColor}">
            ${routes[currentPage].icon}
          </div>
          <div class="text-gray-500 text-xl font-thin">${routes[currentPage].title}</div>
        </div>
        
        <div class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100">
          <div class="p-4">
            <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              ${routes[currentPage].pageComponent}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `.style(style)
}

define('app-categories', Categories)
define('app-file-imports', FileImport)
define('app-nav', Sidebar)
define('app-button', Button)
define('app-transactions', Transactions)
define('app-main', AppMain)



// // WS test
// const ws = new WebSocket(`ws://${window.location.hostname}:8001/wstest`); // TODO: wss

// ws.onopen = function() {
//   console.log('Web socket opened')
//   setTimeout(() => {
//     console.log('sending message')
//     ws.send("Message to send");
//   }, 5000)
// };

// ws.onmessage = function (evt) { 
//   var received_msg = evt.data;
//   console.log(received_msg)
// };

// ws.onclose = function() { 
//   console.log("Web socket closed")
// };