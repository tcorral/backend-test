const Account = require('../../model/account.js')
const Customer = require('../../model/customer.js')
const Transaction = require('../../model/transaction.js')

module.exports = {
  method: 'get',
  route: '/:customerID',
  controller: db => async (req, res, next) => {
    const { customerID } = req.params

    // Validation.
    if (!customerID || Number.isNaN(customerID)) {
      // 404'd
      return next()
    }

    const user = await Customer.getById(db, customerID)
    if (!user) {
      // 404'd again
      return next()
    }

    const response = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      accounts: []
    }

    const accounts = await Account.getByCustomer(db, customerID)
    // This could be parallellised.
    for (let account of accounts) {
      const transactions = await Transaction.getByAccount(db, account.id)
      const accountInfo = {
        id: account.id,
        alias: account.alias || '',
        balance: account.balance,
        transactions
      }
      response.accounts.push(accountInfo)
    }

    return res.status(200).send(response)
  }
}
