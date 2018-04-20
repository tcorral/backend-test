/* global describe it */
const { expect } = require('chai')
const sinon = require('sinon')
const knex = require('knex')
const create = require('../../../../api/controller/account/create.js')

describe('api/controller/account/create', () => {
  describe('create.js', () => {
    describe('configuration', () => {
      it('should have a POST method', () => {
        expect(create.method).to.be.equals('post')
      })

      it('should have a "/" route', () => {
        expect(create.route).to.be.equals('/')
      })
    })

    describe('controller', () => {
      it('should return 400 because no customerID', async () => {
        const req = { body: {} }

        const db = sinon.createStubInstance(knex)
        const send = sinon.spy()
        const res = { status: sinon.stub().returns({ send }), send }

        await create.controller(db)(req, res, () => {})
        expect(send.withArgs({ error: 'Missing customerID.' }).calledOnce).to.be.equals(true)
      })

      it('should return 400 because customerID is a string', async () => {
        const req = { body: { customerID: 'isAString' } }

        const db = sinon.createStubInstance(knex)
        const send = sinon.spy()
        const res = { status: sinon.stub().returns({ send }), send }

        await create.controller(db)(req, res, () => {})
        expect(send.withArgs({ error: 'Invalid customer ID.' }).calledOnce).to.be.equals(true)
      })
    })
  })
})
