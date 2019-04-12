# ElIoT

IoT Home Automation bridge for Google Home and Alexa

## Getting Started

### Initialize

Clone this repository and then install npm dependencies:
```bash
npm install
```

### Generate OAuth2 credentials

Generate OAuth2 client ID and client secret, a valid option could be an online string generator like [random-string-generator](http://www.unit-conversion.info/texttools/random-string-generator/) or using `pwgen` command:
```bash
pwgen -n 20
```
recommended length is 20 for client ID and 40 for client secret and format `[a-zA-Z0-9]`.

Set required configurations credentials coping file `credentials.sample.yml` to `credentials.yml`:
```yml

# Authentication

clientId: xxxxxxxxxxxxxxxxxxxx
clientSecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

```

### Deploy

Deploy the application using `deploy` npm script:
```bash
npm run deploy
```

## Debugging

To see Lambda functions log use the `log` npm scripts:
```bash
npm run auth:log
```
```bash
npm run token:log
```
```bash
npm run googleHome:log
```

During tests is convenient to use a REST client like [Insomnia](https://insomnia.rest/) and watch tail function's log using:
```bash
npm run auth:log:watch
```
```bash
npm run token:log:watch
```
```bash
npm run googleHome:log:watch
```
