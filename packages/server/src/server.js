import Fastify from 'fastify'
import fastifyMultipart from 'fastify-multipart'
import fastifyWebSocket from 'fastify-websocket'
import fastifySwagger from 'fastify-swagger'

import diPlugin from './di-container.js'
import schema from './schema.json'

import transactionRoutes, { getTransactions, getTransaction, patchTransactions } from './routesold/transaction-handler.js'
import { getUploads, uploadFiles } from './routesold/upload-handler.js'
import { getCategories, postCategory } from './routesold/category-handler.js'

import TransactionRepository from './repository/transaction-repo.js'
import TransactionDao from './dao/transaction-dao.js'
import TransactionService from './service/transaction-service.js'
import CategoryRepository from './repository/category-repo.js'
import CategoryDao from './dao/category-dao.js'
import UploadRepository from './repository/upload-repo.js'
import UploadDao from './dao/upload-dao.js'
import AccountRepository from './repository/account-repo.js'
import AccountDao from './dao/account-dao.js'

// import Database from './utils/database.js'
import awilix from 'awilix'
import knex from 'knex'

import fs from 'fs'

const server = async (options) => {
  const app = Fastify(options)
  // const database = new Database('test')
  // database.setup().catch(ex => console.warn('DB may already be setup', ex))

  // Register plugins
  await app.register(diPlugin)
  app.register(fastifyWebSocket)
  app.register(fastifyMultipart)
  app.register(fastifySwagger, schema.swagger) 

  // Register schemas
  schema.shared.forEach(sharedSchema => app.addSchema(sharedSchema))

  // Dependency injection container
  app.diContainer.register({
    db: awilix.asFunction(() => knex({
        client: 'sqlite3',
        connection: {
          filename: "./data/dev.sqlite"
        }
      }))
      // .disposer(async db => db.close())
      .singleton()
  })

  app.addHook('onRequest', async (request, _) => {
    request.diScope.register({
      transactionDao: awilix.asClass(TransactionDao, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      transactionRepository: awilix.asClass(TransactionRepository, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      transactionService: awilix.asClass(TransactionService, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      categoryDao: awilix.asClass(CategoryDao, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      categoryRepository: awilix.asClass(CategoryRepository, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      uploadDao: awilix.asClass(UploadDao, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      uploadRepository: awilix.asClass(UploadRepository, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      accountDao: awilix.asClass(AccountDao, {
        lifetime: awilix.Lifetime.SCOPED
      }),
      accountRepository: awilix.asClass(AccountRepository, {
        lifetime: awilix.Lifetime.SCOPED
      })
    })
  })

  // app.decorate('db', database)

      // u: asFunction(
      //   ({ userRepository }) => { return new UserService(userRepository, request.params.countryId) }, {
      //   lifetime: Lifetime.SCOPED,
      //   dispose: (module) => module.dispose(),
      // }),

  // Register routes
  const routePath = './src/routes/'
  for await (let file of fs.readdirSync(routePath)) {
    await (await import(`./routes/${file}`)).default(app)
  }

  // app.get('/transactionsold', {
  //   schema: schema.getTransactions,
  //   handler: getTransactions
  // })

  // app.patch('/transactionsold', {
  //   schema: schema.patchTransactions,
  //   handler: patchTransactions
  // })
  
  // app.get('/transactionsold/:transactionId', {
  //   schema: schema.getTransaction,
  //   handler: getTransaction
  // })

  // app.get('/categories', {
  //   schema: schema.getCategories,
  //   handler: getCategories
  // })

  // app.post('/categories', {
  //   schema: schema.postCategory,
  //   handler: postCategory
  // })

  // app.get('/imports2', {
  //   schema: schema.getUploads,
  //   handler: getUploads
  // })

  // app.post('/upload2', {
  //   schema: schema.uploadFiles,
  //   handler: uploadFiles
  // })

  // app.get('/wstest', { websocket: true }, function (connection, req) {
  //   console.log('connection established')
  //   connection.socket.on('message', message => {
  //     // message === 'hi from cli
  //     console.log('received message', message)
  //     connection.socket.send('hi from server')
  //   })
  // })

  return app
}

export default server