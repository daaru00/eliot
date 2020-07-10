# Eliot

IoT Home Automation bridge for Google Home and Alexa

## Getting Started (application deploy)

This template is deployed into [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/).
Just search "eliot" into repository and install it.

## Getting Started (local deploy)

### Initialize

Clone this repository and then install npm dependencies:
```
npm install
```

### Credentials

Set required configurations credentials coping file `.environment.example` to `.environment`:
```bash
export AWS_PROFILE=
```
or
```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

### Build

Run build step running:
```bash
npm run build
```
this will use webpack with [SAM plugin](https://github.com/graphboss/aws-sam-webpack-plugin) to generate function's code.

### Deploy

Run the first deploy with:
```bash
npm run deploy:guided
```
follow the interactive setup wizard and it generate `samconfig.toml` configuration file.

Run next deploy with:
```bash
npm run deploy
```

Remember to build application before all deploy, here a npm script that do this:
```bash
npm run build:deploy
```

### Remove

Get current stack name from `samconfig.toml` file (settings key is `stack_name`) and use AWS CLI:
```bash
aws --profile <my profile> cloudformation delete-stack --stack-name <my stack name>
```
this will remove the CloudFormation stack and all created resources.
