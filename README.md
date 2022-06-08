## App
App is accessible on:
http://localhost:3000/

## Documentation
Swagger documentation is accessible:
http://localhost:3000/

## Description
Backend part of Creator pools application, writen in Node.js with Nest framework, using MongoDB as database.

Read [Nest](https://github.com/nestjs/nest) documentation [here](https://docs.nestjs.com/).

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Development 

```bash
# cd to /src directory

# Generate CRUD resource (with test files)
$ nest g resource [name]

# Generate CRUD resource (without test files)
$ nest g resource [name] --no-spec

# Select Transport layet = REST API, CRUD entry points = Yes

# You should almost always generate with nest g resource
# Generate only module
$ nest g mo [name]
# Generate only controller
$ nest g co [name]
# Generate only service
$ nest g s [name]

```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Enviroment variables

MONGO_URL=`Connection link to our database`
MORALIS_URL=`Connection link to Moralis database (You need to whitelist IP in Moralis)`
WEB3_HTTP_PROVIDER =`Smartcontract provider link`
STAKING_CONTRACT_ADDRESS=`Default staking contract address it can be set in config file`
SWAY_TOKEN_ADDRESS=`Default token contract address it can be set in config file`
PORT=`Port number`
CONFIG=`Name of default config to use`


