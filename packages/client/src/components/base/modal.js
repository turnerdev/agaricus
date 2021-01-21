import { dispatch, html } from 'hybrids'
import style from 'bundle-text:../../style.css'

const states = Object.freeze({
  hiding: Symbol('HIDING'),
  hidden: Symbol('HIDDEN'),
  displaying: Symbol('DISPLAYING'),
  displayed: Symbol('DISPLAYED'),
})

const classesModal = [
  'max-h-full',
  'inline-block',
  'align-bottom',
  'bg-white',
  'text-left',
  'overflow-hidden',
  'shadow-xl',
  'transform',
  'transition-all',
  'sm:my-8',
  'sm:align-middle',
  'sm:max-w-lg',
  'sm:w-full',
]

const classesOverlay = ['fixed', 'inset-0', 'transition-opacity']

const classes = {
  overlay: {
    show: [...classesOverlay, 'ease-out', 'duration-300', 'opacity-100'],
    hide: [...classesOverlay, 'ease-in', 'duration-200', 'opacity-0'],
  },
  modal: {
    show: [
      ...classesModal,
      'ease-out',
      'duration-300',
      'opacity-100',
      'sm:scale-100',
    ],
    hide: [
      ...classesModal,
      'ease-in',
      'duration-200',
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    ],
  },
}

function handleHide(host) {
  dispatch(host, 'hide')
}

function handleKeyDown(host, event) {
  if (event.code === 'Escape') {
    handleHide(host)
  }
}

export default {
  state: states.hidden,
  visible: {
    connect: (host, key) => (host[key] = false),
    observe: (host, value) => {
      if (value) {
        host.state = states.displaying
        setTimeout(() => {
          host.state = states.displayed
        }, 10)
      } else {
        host.state = states.hiding
        setTimeout(() => {
          host.state = states.hidden
        }, 300) // TODO: Listen for transionend event
      }
    },
  },
  render: ({ state }) =>
    html`
    <div class="fixed z-50 inset-0 overflow-y-auto ${
      state === states.hidden ? 'hidden' : ''
    }">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" onkeydown=${handleKeyDown}>
      <div class=${
        state === states.displayed ? classes.overlay.show : classes.overlay.hide
      } aria-hidden="true" onclick=${handleHide}>
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class=${
        state === states.displayed ? classes.modal.show : classes.modal.hide
      } role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-hidden">
          <slot name="body"></body>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <slot name="footer"></slot?>
        </div>
      </div>
    </div>
  </div>
  `.style(style),
}
