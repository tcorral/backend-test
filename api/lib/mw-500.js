module.exports = (error, req, res, next) => {
  console.error(error.message)
  res.status(500).send({ errorCode: 500, message: 'Internal server error' })
}
