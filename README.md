# Eliot

IoT Home Automation bridge for Google Home and Alexa

## Project status

### Google Home

![account linking: ready](https://img.shields.io/static/v1.svg?label=account%20linking&message=ready&color=green)

![devices sync: ready](https://img.shields.io/static/v1.svg?label=devices%20sync&message=ready&color=green)
![devices query: ready](https://img.shields.io/static/v1.svg?label=devices%20query&message=ready&color=green)
![devices commands: ready](https://img.shields.io/static/v1.svg?label=devices%20commands&message=ready&color=green)

![devices list change: ready](https://img.shields.io/static/v1.svg?label=devices%20list%20change&message=ready&color=green)
![status notification: not supported](https://img.shields.io/static/v1.svg?label=status%20notification&message=not%20supported&color=red)

### Alexa
![account linking: ready](https://img.shields.io/static/v1.svg?label=account%20linking&message=ready&color=green)

![devices sync: ready](https://img.shields.io/static/v1.svg?label=devices%20sync&message=ready&color=green)
![devices query: ready](https://img.shields.io/static/v1.svg?label=devices%20query&message=ready&color=green)
![devices commands: ready](https://img.shields.io/static/v1.svg?label=devices%20commands&message=ready&color=green)

![devices list change: ready](https://img.shields.io/static/v1.svg?label=devices%20list%20change&message=ready&color=green)
![status notification: work in progress](https://img.shields.io/static/v1.svg?label=status%20notifications&message=work%20in%20progress&color=orange)

## Getting Started

### Initialize

Clone this repository and then install npm dependencies:
```
npm install
```

### Generate OAuth2 credentials

Generate OAuth2 client ID and client secret, a valid option could be an online string generator like [random-string-generator](http://www.unit-conversion.info/texttools/random-string-generator/) or using `pwgen` command:
```
pwgen -n 20
```
recommended length is 20 for client ID and 40 for client secret and format `[a-zA-Z0-9]`.

Set required configurations credentials coping file `credentials.sample.yml` to `credentials.yml`:
```yml
# Authentication

clientId: xxxxxxxxxxxxxxxxxxxx
clientSecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Create a Google Home integration

Create a new Smart Home Action on [developer console](https://console.actions.google.com) and give it a name following the quick setup procedure.

### Create a Alexa 

Create a new Skill for Smart Home on [developer console](https://developer.amazon.com/alexa/console/ask) and give it a name during setup.

### Deploy

Deploy the application using `deploy` npm script:
```
npm run deploy
```
when done login to [AWS Console](https://aws.amazon.com/it/console/) and go to CloudFormation service, you will see a stack named **eliot**. In this section you can see the output variables that helps you to configure the next steps.

### Setup Google Home account linking 

Go to your Smart Home Action project page, on the left menù under **Advanded Option** select **Account linking** and insert this configurations:

#### Section: Account creation

Slect **No** option.

#### Section: Linking type

Select **OAuth** and **Authorization code**.

#### Section: Client information

Insert the the stack's outputs as follow:

- Client ID: **OAuthClientId**
- Client secret: **OAuthClientSecret**
- Authorization URL: **OAuthEndpoint**
- Token URL: **OAuthTokenEndpoint**

#### Section: Configure your client (optional) 

Leave empty

#### Section: Testing instructions

Insert any value, for example: *nope*. This actions will not submitted for Google approval so will not be tested.

### Setup Alexa account linking

Got to your Smart Home Skill page on **Build** tab (the tab selected by default) and Insert this configurations:

#### Section: Payload version

Leave the default value selected **v3 (preferred)**.

#### Section: Smart Home service endpoint

Insert in **Default endpoint** text fiels the stack's output **AlexaLambdaARN** value, this have to be an ARN format: `arn:aws:lambda:<region>:<accountid>:function:eliot-test-alexa`

#### Section: Account Linking

Insert the the stack's outputs as follow:

- Authorization URI: **OAuthEndpoint**
- Access Token URI: **OAuthTokenEndpoint**
- Client ID: **OAuthClientId**
- Client secret: **OAuthClientSecret**
- Client Authentication Scheme: select **Credentials in request body**
- Scope: insert any value, for example: **nope**

### Finalize

Return to your Serverless project and set the remaing configurations.

#### Google Home

Grab your project id from the console url, you should be on a URL like `https://console.actions.google.com/u/0/project/aaaaaa-00000/overview` where `aaaaaa-00000` is your project id. 
Insert it into configuration file:
```yml
# Configurations

googleProjectId: myproject-00000
```

#### Alexa

Got to **Build** tab and get your Skill id from the section **2. Smart Home service endpoint** aside **Your Skill ID** label. 
It should be an ARN, similar to `amzn1.ask.skill.aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa`, copy it and set into configuration file:
```yml
# Configurations

alexaSkillId: amzn1.ask.skill.xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx
```

## Setup IoT Things

Now you are ready to connect your AWS IoT things, go to the AWS Console and select **IoT Core** service. 

### Create a new Thing Type

Now go to **Manage** then **Types** and create a new type. A suggested type name can be **SmartHome**, the required configuration is to create two searchable attributes under **Set searchable thing attributes** section. 

Create these respecting the lowercase:
- sync
- type

### Connect new and existing IoT Things

Open an existing Thing and set the create types **SmartHome**, valorize the *sync* attribute with: **enable**. Then set the *type* attribute based on the things type, for example: *Light*.

## Control IoT Things

Now you can control you device from Google Home or Alexa device, also from their smartphone applications.

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
