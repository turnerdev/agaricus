import { dispatch, html } from 'hybrids'
import style from 'bundle-text:../style.css'

const commonClasses = ['relative','inline-flex','items-center','px-4','py-2','border','text-sm','font-medium']

const classes = {
  currentPage: [...commonClasses, 'border-primary-500','bg-primary','text-white','z-10'],
  default: [...commonClasses, 'border-gray-300','bg-white','text-gray-700','hover:bg-gray-50'],
  ellipsis: [...commonClasses, 'border-gray-300','bg-white','text-gray-700', 'cursor-default']
}

function changePage(host, page) {
  dispatch(host, 'change-page', {
    bubbles: true,
    composed: true, 
    detail: page
  })
}

function handleSelectPage(host, event) {
  const page = event.target.dataset.page
  changePage(host, Number(page))
}

function handleNext(host, event) {
  if (host.currentPage < host.pages) {
    changePage(host, host.currentPage+1)
  }
}

function handlePrevious(host, event) {
  if (host.currentPage > 1) {
    changePage(host, host.currentPage-1)
  }
}

export default {
  neighbourhood: 1,
  pages: 0,
  currentPage: 0,
  displayedPages: {
    get: ({ currentPage, pages, neighbourhood }) => [...new Set([
      1,
      ...[...Array(1+neighbourhood*2).keys()].map(i => i+currentPage-neighbourhood).filter(page => page >= 1 && page <= pages),
      pages
    ])]
  },
  render: ({ currentPage, displayedPages }) => html`
    <nav class="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination" role="navigation">
      <a href="javascript:void(0)" onclick=${handlePrevious} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
        <span class="sr-only">Previous</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </a>
      ${displayedPages.map((page, i) => html`
        ${i>0 && displayedPages[i-1] !== (page-1) && html`
          <div class=${classes.ellipsis}>...</div>
        `}
        <a href="javascript:void(0)" data-page='${page}' onclick=${handleSelectPage} class=${page === currentPage ? classes.currentPage : classes.default}>
          ${page}
        </a>
      `)}
      <a href="javascript:void(0)" onclick=${handleNext} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
        <span class="sr-only">Next</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </a>
    </nav>
  `.style(style)
}