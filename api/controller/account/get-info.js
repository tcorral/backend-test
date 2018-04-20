module.exports = {
  method: 'get',
  route: '/:customerID',
  controller: db => (req, res, next) => {
    return res.status(200).send(req.params.customerID)
  }
}
