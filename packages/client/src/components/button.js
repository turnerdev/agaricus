import { html } from 'hybrids'
import style from 'bundle-text:../style.css'

const classes = {
  'default': ["w-full", "whitespace-nowrap", "hover:bg-gray-100","text-sm", "py-2", "sm:py-3","px-4","border","text-gray-600","border-gray-200","rounded","font-bold","flex","justify-center","items-center","focus:outline-none","focus:ring-2","focus:ring-primary-100"],
  'primary': ["w-full", "whitespace-nowrap", "bg-primary","hover:bg-primary-500","text-white","text-sm","py-2", "sm:py-3","px-4","border","border-primary","rounded","font-bold","flex","justify-center","items-center","focus:outline-none","focus:ring-2","focus:ring-primary-200"]
}

export default {
  variant: "default",
  render: ({ variant }) => html`
    <button class="${classes[variant]}">
      <slot></slot>
    </button>`.style(style)
}