import { store } from 'hybrids'
import Currencies from '../i18n/currency'

// Parse the language and country from the browser navigator object
const { language, country } = navigator.language.match(
  /(?<language>\w{2})-(?<country>\w{2})/
).groups

const Preferences = {
  language,
  currency: Currencies[country],
  [store.connect]: {
    get: () => ({
      ...Preferences,
      ...(localStorage.getItem('preferences') || {}),
    }),
    set: (id, values, keys) => {
      localStorage.setItem('preferences', JSON.stringify(values))
    },
  },
}

export default Preferences
