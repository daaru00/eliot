# Eliot

IoT home automation bridge for [AWS IoT Core](https://aws.amazon.com/iot-core/) and your home assistant Google Home and/or Alexa.

## Configure third party services

Before deploying check the instructions below to set up a private integration from the voice assistant you use.

### Google Home

1. [Create Google Action](https://github.com/eliot-iot/eliot/wiki/Create-Integrations---Google)
2. [Deploy Infrastructure](https://github.com/eliot-iot/eliot/wiki/Infrastructure---Deploy)
3. [Connect Google Action](https://github.com/eliot-iot/eliot/wiki/Connect---Google)
4. [Configure Account Linking](https://github.com/eliot-iot/eliot/wiki/Account-Linking---Google)

### Alexa

1. [Create Alexa Skill](https://github.com/eliot-iot/eliot/wiki/Create-Integrations---Alexa)
2. [Deploy Infrastructure](https://github.com/eliot-iot/eliot/wiki/Infrastructure---Deploy)
3. [Connect Google Action](https://github.com/eliot-iot/eliot/wiki/Connect---Alexa)
4. [Configure Account Linking](https://github.com/eliot-iot/eliot/wiki/Account-Linking---Alexa)

## Deploy

Deploy from Serverless Application Repository:

| Region       | Support            | Install Link                                 |
| ------------ | ------------------ | -------------------------------------------- |
| eu-west-1    | :heavy_check_mark: | [install](https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/create/app?applicationId=arn:aws:serverlessrepo:eu-west-1:597720084096:applications/eliot)    |
| eu-central-1 | :heavy_check_mark: | [install](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/create/app?applicationId=arn:aws:serverlessrepo:eu-central-1:597720084096:applications/eliot) |
| us-east-1    | :heavy_check_mark: | [install](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:597720084096:applications/eliot)    |
| us-east-2    | :heavy_check_mark: | [install](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/create/app?applicationId=arn:aws:serverlessrepo:us-east-2:597720084096:applications/eliot)    |
| eu-south-1   | :x:                |                                              |
| af-south-1   | :x:                |                                              |

## Manage your devices

List of supported devices: https://github.com/eliot-iot/eliot/wiki/Devices-Managment---Devices

Subscribe to device events: https://github.com/eliot-iot/eliot/wiki/Devices-Managment---Notifications

Device Shadow management workflow: https://github.com/eliot-iot/eliot/wiki/Devices-Managment---Shadow
