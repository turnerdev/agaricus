/**
 * Autofocus on the first input element
 * @param {*} host
 */
export function autofocus(host) {
  setTimeout(() => {
    host?.querySelector('input:not(:disabled)')?.focus()
    host?.shadowRoot?.querySelector('input:not(:disabled)')?.focus()
  }, 50)
}

/**
 * Partial function application
 * @param {Function} fn
 * @param  {...any} args
 */
export const apply = (fn, ...args) => (...lastArgs) => fn(...args, ...lastArgs)

/**
 * Clone an object omitting certain properties
 * @param {Object} obj
 * @param {Array} keys
 */
export function omit(obj, keys) {
  return Object.keys(obj)
    .filter(k => !~keys.indexOf(k))
    .reduce(
      (nObj, k) => ({
        ...nObj,
        [k]: obj[k],
      }),
      {}
    )
}
