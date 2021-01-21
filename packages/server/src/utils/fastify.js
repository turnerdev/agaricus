// import * asawilix from 'awilix'
import * as awilix from 'awilix'
import querystring from 'querystring'

// Fix weird interoperability issue with awilix ESM runtime + babel-jest
const { createContainer } = awilix.default || awilix

// const { createContainer } = awilix

export function querystringParser(str) {
  const result = querystring.parse(str)
  const integerArrays = Object.keys(result).filter((k) =>
    result[k].match(/\[(\d|null)+(,\s*(\d|null)+)*\]/)
  )
  return Object.assign(
    result,
    integerArrays.reduce((a, c) => ({ ...a, [c]: JSON.parse(result[c]) }), {})
  )
}

async function plugin(app, opts) {
  const container = createContainer()

  app
    .decorate('diContainer', container)
    .decorateRequest('diScope', null)
    .addHook('onRequest', async (request, _) => {
      request.diScope = app.diContainer.createScope()
    })
    .addHook('onClose', async (instance) => app.diContainer.dispose())
    .addHook('onResponse', async (request, response) =>
      request.diScope.dispose()
    )
}

plugin[Symbol.for('skip-override')] = true

export const diPlugin = plugin

// const main = {
//   diPlugin,
//   querystringParser,
// }

// export default main
