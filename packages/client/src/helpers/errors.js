import { store } from 'hybrids'
import { Application } from '../stores'

export async function applicationError(host, message, data) {
  console.error(`${message}`, data)
  return store.set(Application, {
    errors: [{ message }, ...store.get(Application).errors],
  })
}
