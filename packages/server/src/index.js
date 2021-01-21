import Server from './server.js'

Server(
  {
    logger: {
      level: 'info',
    },
    ajv: {
      customOptions: {
        strict: 'log',
        unevaluatedProperties: false,
      },
    },
  },
  './data/dev.sqlite'
).then((server) => {
  server.listen(8001, (err, address) => {
    if (err) throw err
    server.log.info(`Server listening on ${address}`)
  })
})
