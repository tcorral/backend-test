const TABLE_NAME = 'Account'

/**
 * Creates the table user in a database if it does not exist. It can be dropped
 * if it exists.
 *
 * CREATE TABLE account (
 *     id      INTEGER PRIMARY KEY
 *                     UNIQUE
 *                     NOT NULL,
 *     alias   TEXT,
 *     customer_id INTEGER NOT NULL,
 *     balance BIGINT  DEFAULT (0),
 *     FOREIGN KEY (
 *         customer_id
 *     )
 *     REFERENCES user (id) ON DELETE SET NULL
 *                          ON UPDATE CASCADE
 * );
 *
 * It is a design decision to set the customer ID as null in case of the user
 * details being removed. With the GDPR and new privacy laws, the user
 * information can be removed at any time, but the accounts for the sake of the
 * transaction integrity cannot be deleted. Therefore, in case there is a customer
 * who decided to use his rights, we need assume that the personal can be
 * erased.
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
      table.text('alias')
      table.integer('customer_id').notNullable()
      table.biginteger('balance').notNullable().defaultTo(0)
      table.foreign('customer_id').references('Customer.id').onUpdate('cascade').onDelete('set null')
    })
  }
}

/**
 * Inserts a new transaction in the database.
 *
 * @param {Connector} trx - Connector: database, transaction or mockup.
 * @param {number} customerID - ID of the user.
 * @param {string}  alias - Name that the user gives to the account.
 * @param {number} amount - Balance of the account.
 * @throws {Exception} If the transaction fails or error.
 */
async function insert (trx, customerID, alias = null, amount = 0) {
  const [id] = await trx(TABLE_NAME).insert({
    'customer_id': customerID,
    alias,
    balance: amount
  })
  return id
}

async function getById (trx, accountId) {
  const [account] = await trx.select().from(TABLE_NAME).where('id', accountId)
  return account
}

async function getByCustomer (trx, customerID) {
  const entries = await trx.select()
    .from(TABLE_NAME).where('customer_id', customerID)
  return entries
}

/**
 * Updates the values of an account.
 *
 * @param {Connector} trx - Connector: database, transaction or mockup.
 * @param {number} customerID - ID of the user.
 * @param {string}  alias - Name that the user gives to the account.
 * @param {number} amount - Balance of the account.
 * @throws {Exception} If the transaction fails or error.
 */
async function update (trx, accountId, customerID, alias, balance) {
  trx(TABLE_NAME).where('id', '=', accountId).update({
    'customer_id': customerID,
    alias,
    balance
  })
}

module.exports = {
  createTable,
  getById,
  getByCustomer,
  insert,
  update
}
