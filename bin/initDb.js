const db = require('../db')
const Customer = require('../api/model/customer.js')
const Account = require('../api/model/account.js')
const Transaction = require('../api/model/transaction.js')

async function run () {
  try {
    await db.transaction(async trx => {
      await Customer.createTable(trx, true)
      await Account.createTable(trx, true)
      await Transaction.createTable(trx, true)
    })
  } catch (e) {
    console.error(e)
  } finally {
    db.destroy()
  }
}

run()
