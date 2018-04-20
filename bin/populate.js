const faker = require('faker')
const process = require('process')

const db = require('../db')
const Customer = require('../api/model/customer.js')
const Account = require('../api/model/account.js')
const Transaction = require('../api/model/transaction.js')

async function run () {
  // eslint-disable-next-line
  const [a, b, type, ...args] = process.argv
  try {
    await db.transaction(async trx => {
      switch (type) {
        case 'customer':
          const name = args[0] || faker.name.firstName()
          const surname = args[1] || faker.name.lastName()
          const newCustomerId = await Customer.insert(trx, name, surname)
          console.log(`Created customer: ${newCustomerId}`)
          break

        case 'account':
          const customerID = args[0]
          if (!customerID) {
            throw new Error('Missing customer id')
          }

          const alias = args[1] || null
          const initial = args[2] || 0
          const newAccountId = await Account.insert(trx, customerID, alias, initial)
          console.log(`Created account: ${newAccountId}`)
          break

        case 'transaction':
          const orig = args[0]
          const dest = args[1]
          const amount = args[2]

          if (!orig || !dest || !amount) {
            throw new Error('Missing value')
          }
          const newTransId = await Transaction.insert(trx, orig, dest, amount)
          console.log(`Created transaction: ${newTransId}`)
          break

        default:
          throw new Error(`Invalid command: ${type}`)
      }
    })
  } catch (e) {
    console.error(e.message)
  } finally {
    db.destroy()
  }
}

run()
