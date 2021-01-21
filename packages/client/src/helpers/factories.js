import { store } from 'hybrids'

/**
 * Factory property for handling new and existing stores
 * @param {object} Model Store
 * @param {string} idProp Name of host property representing the model ID
 */
export const draftStoreFactory = (Model, idProp) => {
  const newDraft = store(Model, { draft: true })
  let existingDraft = store(Model, { id: idProp, draft: true })

  return {
    get: (host, lastValue) => {
      const nLastValue = lastValue && lastValue.id === host[idProp] && lastValue
      if (host[idProp] == null || isNaN(host[idProp])) {
        const result = newDraft.get(host, nLastValue)
        if (host.selectedId == null) {
          host.selectedId = result.id
        }
        return result
      }
      return existingDraft.get(host, nLastValue)
    },
    set: async (host, values, lastValue) => {
      if (values == null) {
        const instance = await store.get(Model, lastValue.id)
        await store.set(instance, null)
      }
    },
    connect: () => () => store.clear(Model, false),
  }
}
