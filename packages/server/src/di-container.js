import awilix from 'awilix';

async function plugin(app, opts) {
  app
    .decorate('diContainer', awilix.createContainer())
    .decorateRequest('diScope', null)
    .addHook('onRequest', async (request, _) => {
      request.diScope = app.diContainer.createScope()
    })
    .addHook('onClose', async (instance) => app.diContainer.dispose())
    .addHook('onResponse', async (request, response) => request.diScope.dispose())
}

plugin[Symbol.for('skip-override')] = true

export default plugin