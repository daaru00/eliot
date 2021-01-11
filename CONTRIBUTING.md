# Eliot

IoT Home Automation bridge for Google Home and Alexa

## Getting Started (application deploy)

This template is deployed into [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/).
Just search "eliot" and install it.

## Getting Started (local deploy)

This project is based on [AWS SAM framework](https://aws.amazon.com/it/serverless/sam/), before start install and configure it. Check the [AWS documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) about CLI installation.

note: you can install it from [pip](https://pypi.org/project/aws-sam-cli/) running `pip3 install aws-sam-cli`.

### Initialize

Clone this repository and then install npm dependencies:
```
npm install
```

### Credentials

Set required configurations credentials for AWS SAM CLI:
```bash
export AWS_PROFILE=
```
or
```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

### SAM CLI configurations

You can create a `samconfig.toml` on first deploy adding `--guided` parameter to `sam deploy` command  or you can manually create the file:
```toml
version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
template_file = "template-dev.yml"
profile = "myprofile"
stack_name = "eliot-dev"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-xxxxxxxxxx"
s3_prefix = "eliot-dev"
region = "eu-west-1"
capabilities = "CAPABILITY_IAM CAPABILITY_AUTO_EXPAND"
parameter_overrides = "ClientId=\"xxxxxxxxxxxxxxx\" ClientSecret=\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\" GoogleProjectId=\"my-project-id\" GoogleJwt=\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\" AlexaSkillId=\"amzn1.ask.skill.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx\" AlexaClientId=\"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\" AlexaClientSecret=\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\""
```

Change `profile` configuration with your AWS CLI profile configured in `~/.aws/credentials`.
Change `region` configuration with AWS region you want to deploy to.

Change `s3_bucket` configuration with your bucket name.
Change `s3_prefix` configuration with a key prefix for template artifact.

The `GoogleJwt` parameter need to be set with the escaped version of Google JWT file content. 
```bash
$ cat user-xxxxx-xxxxxxxxxxxxx.json | tr -d '\r\n' | tr -d '\n' | sed 's#\ \ \"#\"#g' | sed 's#\/#\\\\\/#g' | sed 's#\"#\\\\\\"#g'
{\\\"type\\\": \\\"service_account\\\",\\\"project_id\\\": \\\"user-xxxxx\\\",\\\"private_key_id\\\"...
```

### Deploy

There are different SAM template in this project

If you want to deploy the **base version** of the application (useful to test the final installation flow):
```bash
sam deploy --template-file=template.yml
```

If you want to share your **Lambda Layers** versions:
```bash
sam deploy --template-file=layers/template.yml
```

If you want to deploy the **development version** of the application (all nested application will be loaded from local file):
```bash
sam deploy --template-file=template-dev.yml
```

### Remove

Get current stack name from `samconfig.toml` file (settings key is `stack_name`) and use AWS CLI:
```bash
aws --profile <my profile> cloudformation delete-stack --stack-name <my stack name>
```
this will remove the CloudFormation stack and all created resources.

### Propose changes

Open an issue and describe the problem you are solving and how. Then fork this repository and made a pull request to this repository if you what to propose some changes through a PR.

### Publish new version

The new version publish pipeline is automated with GitHub Action declared in `.github/workflows` directory. 
The publish action is configured to run when a new repository tag is pushed (need to respect the Semantic Versioning syntax).
