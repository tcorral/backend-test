const TABLE_NAME = 'Customer'

/**
 * Creates the table customer in a database if it does not exist. It can be dropped
 * if it exists.
 *
 * CREATE TABLE Customer (
 *    id      INTEGER PRIMARY KEY AUTOINCREMENT
 *                     NOT NULL
 *                     UNIQUE,
 *    name    TEXT    NOT NULL,
 *    surname TEXT    NOT NULL
 * );
 *
 * @param {Connector} trx - Connector: database, transaction or mockup.
 * @param {Boolean} drop - True to drop the table if it exists.
 * @throws {Exception} If the transaction fails or error.
 */
async function createTable (trx, drop) {
  if (drop) {
    await trx.schema.dropTableIfExists(TABLE_NAME)
  }
  const exists = await trx.schema.hasTable(TABLE_NAME)
  if (!exists) {
    await trx.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary()
      table.text('name').notNullable()
      table.text('surname').notNullable()
    })
  }
}

async function getById (trx, customerID) {
  const [customer] = await trx.select().from(TABLE_NAME).where('id', customerID)
  return customer
}

/**
 * Inserts a new user in the database.
 *
 * @param {Connector} trx - Connector: database, transaction or mockup.
 * @param {string} name - Name of the user.
 * @param {string} surname - Surname of the user.
 * @throws {Exception} If the transaction fails or error.
 */
async function insert (trx, name, surname) {
  const [id] = await trx(TABLE_NAME).insert({ name, surname })
  return id
}

module.exports = {
  createTable,
  getById,
  insert,
  TABLE_NAME
}
