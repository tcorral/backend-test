const Account = require('../../model/account.js')
const Customer = require('../../model/customer.js')
const Transaction = require('../../model/transaction.js')

module.exports = {
  method: 'post',
  route: '/',
  controller: db => async (req, res, next) => {
    const { body } = req
    const { customerID } = body
    const initialCredit = body.initialCredit || 0

    // Validation
    if (!customerID || Number.isNaN(customerID)) {
      return res.status(400).send({ error: 'Missing customerID.' })
    }

    const customer = await Customer.getById(db, customerID)
    if (!customer) {
      return res.status(400).send({ error: 'Invalid customer ID.' })
    }

    // Account creation
    const newAccountId = await Account.insert(db, customerID, null, initialCredit)
    const response = {
      accountID: newAccountId
    }

    if (initialCredit > 0) {
      const transactionId = await Transaction
        .insert(db, null, newAccountId, initialCredit)
      response.transaction = transactionId
    }

    return res.status(201).send(response)
  }
}
