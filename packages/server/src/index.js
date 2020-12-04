import Server from './server.js'

const server = Server({
  logger: {
    level: 'info'
  }
})

server.listen(8001, (err, address) => {
  if (err) throw err
  server.log.info(`Server listening on ${address}`)
})