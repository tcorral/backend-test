module.exports = (req, res, next) => res.status(404).send({ errorCode: 404, message: 'Not found' })
