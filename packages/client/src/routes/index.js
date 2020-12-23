import { define, html } from 'hybrids'

import AccountsPage from './accounts-page'
import DashboardPage from './dashboard-page'
import TransactionsPage from './transactions-page'

export default {
  accounts: {
    title: 'Accounts',
    pageComponent: html`<accounts-page></accounts-page>`.define({ AccountsPage }),
    classes: {
      backgroundColor: 'bg-blue-500'
    },
    icon: html`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    `
  },
  transactions: {
    title: 'Transactions',
    pageComponent: html`<transactions-page></transactions-page>`.define({ TransactionsPage }),
    classes: {
      backgroundColor: 'bg-yellow-500'
    },
    icon: html`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
        </path>
      </svg>
    `
  },
  dashboard: {
    title: 'Dashboard',
    pageComponent: html`<dashboard-page></dashboard-page>`.define({ DashboardPage }),
    classes: {
      backgroundColor: 'bg-red-500'
    },
    icon: html`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
      </svg>
    `
  }
}
