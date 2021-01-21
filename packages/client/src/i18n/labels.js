import { store } from 'hybrids'

import translations from './translations'
import Preferences from '../stores/preferences'

/**
 * Labels proxy class, allows for reference labels with dynamic methods
 * Example: label.my_label_text()
 * Returns: label value in users preferred language if exists,
 * otherwise returns '%my_label_text%' placeholder
 */
export default new Proxy(translations, {
  get: (target, prop) => {
    if (target.hasOwnProperty(prop)) {
      // Get preferred language
      const { language } = store.get(Preferences)

      // Return text, replacing ${0}, ${1}, etc.. with corresponding arg
      return (...args) =>
        target[prop][language].replace(/\$\{(\d)\}/g, (_, id) => args[id])
    } else {
      // Otherwise, return placeholder
      return () => `%${prop}%`
    }
  },
})
