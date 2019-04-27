# Eliot

IoT Home Automation bridge for Google Home and Alexa

## Project status

### Google Home

![account linking: ready](https://img.shields.io/static/v1.svg?label=account%20linking&message=ready&color=green)

![devices sync: ready](https://img.shields.io/static/v1.svg?label=devices%20sync&message=ready&color=green)
![devices query: ready](https://img.shields.io/static/v1.svg?label=devices%20query&message=ready&color=green)
![devices commands: ready](https://img.shields.io/static/v1.svg?label=devices%20commands&message=ready&color=green)

![devices list change: ready](https://img.shields.io/static/v1.svg?label=devices%20list%20change&message=ready&color=green)
![status notification: ready](https://img.shields.io/static/v1.svg?label=status%20notification&message=ready&color=green)

### Alexa
![account linking: ready](https://img.shields.io/static/v1.svg?label=account%20linking&message=ready&color=green)

![devices sync: ready](https://img.shields.io/static/v1.svg?label=devices%20sync&message=ready&color=green)
![devices query: ready](https://img.shields.io/static/v1.svg?label=devices%20query&message=ready&color=green)
![devices commands: ready](https://img.shields.io/static/v1.svg?label=devices%20commands&message=ready&color=green)

![devices list change: ready](https://img.shields.io/static/v1.svg?label=devices%20list%20change&message=ready&color=green)
![status notification: ready](https://img.shields.io/static/v1.svg?label=status%20notifications&message=ready&color=green)

## Getting Started

### Initialize

Clone this repository and then install npm dependencies:
```
npm install
```

### Configurations

Set required configurations credentials coping file `credentials.sample.yml` to `credentials.yml`:
```yml
# Authentication

clientId: xxxxxxxxxxxxxxxxxxxx
clientSecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Follow the [documentation](https://eliot.link/) about Google Home and/or Alexa integration's configurations.

## Debugging

To see Lambda functions log use the `log` npm scripts:
```
npm run auth:log
npm run token:log
npm run authorizer:log
npm run googleHome:log
npm run googleHomeResync:log
npm run alexa:log
npm run alexaResync:log
```

During tests is convenient to use a REST client like [Insomnia](https://insomnia.rest/) and watch tail function's log using:
```
npm run auth:log
npm run token:log
npm run authorizer:log
npm run googleHome:log
npm run googleHomeResync:log
npm run alexa:log
npm run alexaResync:log
```

## Test

There are also a [Mocha](https://mochajs.org/) test suite configured to perform functional and unit tests.

Function test can be runned inside a Lambda named `test` that can the required permission to access resources. To execute tests run:
```
npm run test:remote
```
and you can see the logs using:
```
npm run test:remote:log
```

Units test can be runned locally using:
```
npm run test:local
```

## Lint

All code use the [standard rules](https://standardjs.com/) for coding style. Linter is avaiable running:
```
npm run lint
```

## Remove the application

To completely remove the application run:
```
npm run remove
```
