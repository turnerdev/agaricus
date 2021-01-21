export async function up(knex) {
  // exports.up = async function (knex) {
  await knex.raw('PRAGMA foreign_keys = ON;')

  return knex.schema
    .createTable('uploads', function (table) {
      table.increments('id').primary()
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      // table.timestamp("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.text('name').notNullable()
    })
    .createTable('accounts', function (table) {
      table.increments('id').primary()
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      // table.timestamp("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.text('name').notNullable()
      table.text('currency', 3).notNullable()
    })
    .createTable('categories', function (table) {
      table.increments('id').primary()
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      // table.timestamp("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.string('name', 255).notNullable().unique()
      table.string('color', 10).notNullable()
    })
    .createTable('transactions', function (table) {
      table.increments('id').primary()
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      // table.timestamp("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table
        .bigInteger('upload_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('uploads')
        .onDelete('cascade')
      table
        .bigInteger('account_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
        .onDelete('cascade')
      table
        .bigInteger('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
      table.string('row').notNullable()
      table.date('date').notNullable()
      table.string('description').notNullable()
      table.decimal('amount', 10, 2).notNullable()
    })
}

// exports.down = async function (knex) {
export async function down(knex) {
  return knex.schema
    .dropTable('transactions')
    .dropTable('categories')
    .dropTable('accounts')
    .dropTable('uploads')
}
