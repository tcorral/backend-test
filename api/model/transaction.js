const TABLE_NAME = 'Transaction'

/**
 * Creates the table customer in a database if it does not exist. It can be dropped
 * if it exists.
 *
 * CREATE TABLE [Transaction] (
 *   id          INTEGER PRIMARY KEY,
 *   origin      INTEGER REFERENCES Account (id) ON DELETE NO ACTION
 *                                               ON UPDATE NO ACTION
 *   destination INTEGER REFERENCES Account (id) ON DELETE NO ACTION
 *                                               ON UPDATE NO ACTION
 *                       NOT NULL,
 *   amount      BIGINT  NOT NULL
 *                       DEFAULT (0),
 *   date        DATE    NOT NULL
 * );
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
      table.integer('origin').references('Account.id').onUpdate('no action').onDelete('no action')
      table.integer('destination').notNullable().references('Account.id').onUpdate('no action').onDelete('no action')
      table.biginteger('amount').defaultTo(0)
      table.datetime('date').notNullable()
    })
  }
}

async function getById (trx, transactionID) {
  const [transaction] = await trx.select().from(TABLE_NAME).where('id', transactionID)
  return transaction
}

async function getByAccount (trx, accountID) {
  const transactions = await trx().select()
    .from(TABLE_NAME)
    .where('origin', accountID)
    .orWhere('destination', accountID)
  return transactions
}

async function insert (trx, origin, destination, amount) {
  const [id] = await trx(TABLE_NAME).insert({
    origin,
    destination,
    amount,
    date: Date.now()
  })
  return id
}

module.exports = {
  createTable,
  getById,
  getByAccount,
  insert,
  TABLE_NAME
}
