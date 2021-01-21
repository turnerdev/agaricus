import Fastify from 'fastify'
import fastifyMultipart from 'fastify-multipart'
import fastifyWebSocket from 'fastify-websocket'
import fastifySwagger from 'fastify-swagger'

import schema from './schema.json'
import { querystringParser, diPlugin } from './utils/fastify.js'

import TransactionRepository from './repository/transaction-repo.js'
import TransactionDao from './dao/transaction-dao.js'
import TransactionService from './service/transaction-service.js'
import CategoryRepository from './repository/category-repo.js'
import CategoryDao from './dao/category-dao.js'
import UploadRepository from './repository/upload-repo.js'
import UploadDao from './dao/upload-dao.js'
import AccountRepository from './repository/account-repo.js'
import AccountDao from './dao/account-dao.js'

import * as awilix from 'awilix' // IOC Container
import knex from 'knex' // Database

import fs from 'fs'

const { asFunction, asClass, Lifetime } = awilix.default || awilix

const server = async (options, filename) => {
  const app = Fastify({
    ...options,
    querystringParser,
  })

  // Register plugins
  await app.register(diPlugin)
  app.register(fastifyWebSocket)
  app.register(fastifyMultipart)
  app.register(fastifySwagger, schema.swagger)

  // Register JSON schemas
  schema.shared.forEach((sharedSchema) => app.addSchema(sharedSchema))

  // Dependency injection container
  app.diContainer.register({
    db: asFunction(() => {
      const db = knex({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: filename ? { filename } : ':memory:',
        pool: {
          afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
        },
      })
      db.raw('PRAGMA foreign_keys = ON')
      return db
    }).singleton(),
  })

  // Register classes in request scope
  app.addHook('onRequest', async (request, _) => {
    request.diScope.register({
      transactionDao: asClass(TransactionDao, {
        lifetime: Lifetime.SCOPED,
      }),
      transactionRepository: asClass(TransactionRepository, {
        lifetime: Lifetime.SCOPED,
      }),
      transactionService: asClass(TransactionService, {
        lifetime: Lifetime.SCOPED,
      }),
      categoryDao: asClass(CategoryDao, {
        lifetime: Lifetime.SCOPED,
      }),
      categoryRepository: asClass(CategoryRepository, {
        lifetime: Lifetime.SCOPED,
      }),
      uploadDao: asClass(UploadDao, {
        lifetime: Lifetime.SCOPED,
      }),
      uploadRepository: asClass(UploadRepository, {
        lifetime: Lifetime.SCOPED,
      }),
      accountDao: asClass(AccountDao, {
        lifetime: Lifetime.SCOPED,
      }),
      accountRepository: asClass(AccountRepository, {
        lifetime: Lifetime.SCOPED,
      }),
    })
  })

  // Register routes
  const routePath = './src/routes/'
  for await (let file of fs.readdirSync(routePath)) {
    await (await import(`./routes/${file}`)).default(app)
  }

  return app
}

export default server
