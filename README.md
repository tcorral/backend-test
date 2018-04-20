# Blue Harvest coding test
## TODO
- [x] The API will expose an endpoint which accepts the user information (customerID, initialCredit).
  - [x] A new account will be opened connected to the user whose ID is customerID.
  - [x] If initialCredit is not 0, a transaction will be sent to the new account.
- [x] Another Endpoint will output the user information showing Name, Surname, balance, and transactions of the accounts.

## Available routes
- `GET http://localhost:8080/v1/customer/1`: See all the information from the
  user.
- `POST http://localhost:8080/v1/account/`: Creates a new account.

## Requirements
- Latest LTS of Node.
- SQLite3

## Setup
```
# Install deps.
npm install
# Create database and schema.
npm run db:init
# Add one customer.
npm run db:populate customer
# Add two accounts for the customer.
npm run db:populate account 1 main 1000
npm run db:populate account 1 savings 500
# Add the transaction between the two accounts.
npm run db:populate transaction 1 2 500
# Start the app in production mode.
npm run prod:start
# To stop: npm run prod:stop
# For dev: npm run dev:watch
```

## Testing
Using Mocha + Chai + Sinon + Standard. Currently WIP.
```
npm run test:lint
npm run test:unit
```

## Design decisions
- If `initialCredit` has a invalid value, it will be discarded.
- Simple logging to the stdout has been chosen. It will be handled during
  deployment.
- Models were considered out of the scope and not recommended, but they were
  necessary to achieve a proper logic for the application. The persistance layer
  is on SQLite. They have not been unit tested. They can be easily improved. 
  They are quick and dirty.
- `Customer` is a user of the service. A `Customer` can have several `Account`.
- `Transaction` might have an origin which is an `Account` or be `null` if they
  are direct deposit. It was also planned this way in addition to work on the
  bonus exercise by moving the tables out of the schema.
