'use strict'

const path = require('path')
const fs = require('fs')

class ServerlessPlugin {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options
    this.provider = this.serverless.getProvider('aws')
    this.region = this.serverless.service.provider.region

    this.commands = {
      share: {
        usage: 'Create a sharable CloudFormation template',
        lifecycleEvents: [
          'init',
          'template',
          'code',
          'end'
        ],
        options: {
          bucket: {
            usage:
              'Specify the destination S3 bucket' +
              '(e.g. "--bucket my-service-template-bucket" or "-b my-service-template-bucket")',
            required: true,
            shortcut: 'b'
          }
        }
      }
    }

    this.hooks = {
      'share:init': this.init.bind(this),

      'before:share:template': this.beforeTemplate.bind(this),
      'share:template': this.template.bind(this),
      'after:share:template': this.afterTemplate.bind(this),

      'before:share:code': this.beforeCode.bind(this),
      'share:code': this.code.bind(this),
      'after:share:code': this.afterCode.bind(this),

      'share:end': this.end.bind(this)
    }
  }

  /**
   * Init
   */
  async init () {
    this.deploymentBucket = await this.provider.getServerlessDeploymentBucketName()
    this.deploymentBucketPath = path.join(
      'serverless',
      this.serverless.service.service,
      this.serverless.service.provider.stage,
      '/'
    )
    this.latestVersion = await this.getLatestVersion()
    this.serverless.cli.log(`Deploying version ${this.latestVersion}..`)
    this.archiveFileName = `${this.serverless.service.service}.zip`
    this.destBucket = this.options.bucket
  }

  /**
   * Template hooks
   */
  beforeTemplate () {
    this.serverless.cli.log('Deploying CloudFormation template..')
  }
  async template () {
    let templateData = await this.getCurrentTemplate()
    templateData = this.elaborateTemplate(templateData)
    await this.saveTemplate(templateData)
  }
  afterTemplate () {
    this.serverless.cli.log('CloudFormation template is ready to share!')
  }

  /**
   * Code hooks
   */
  beforeCode () {
    this.serverless.cli.log('Deploying code archive..')
  }
  async code () {
    await this.downloadCode('/tmp/code.zip')
    await this.uploadCode('/tmp/code.zip')
  }
  afterCode () {
    this.serverless.cli.log('Code archive is ready to share!')
  }

  /**
   * End hook
   */
  end () {
    this.serverless.cli.log(`Version ${this.latestVersion} deployed!`)
  }

  /**
   * Get latest code version
   *
   * @returns {Promise}
   */
  async getLatestVersion () {
    const response = await this.provider.request('S3', 'listObjectsV2', {
      Bucket: this.deploymentBucket,
      Delimiter: '/',
      Prefix: this.deploymentBucketPath
    }, this.options.stage, this.region)

    const latestVersion = response.CommonPrefixes.sort().reverse()[0]
    if (latestVersion === undefined) {
      throw new Error('Version not found')
    }
    return latestVersion.Prefix
  }

  /**
   * Retrieve current template
   *
   * @returns {String}
   */
  async getCurrentTemplate () {
    const response = await this.provider.request('S3', 'getObject', {
      Bucket: this.deploymentBucket,
      Key: path.join(this.latestVersion, 'compiled-cloudformation-template.json')
    }, this.options.stage, this.region)

    return JSON.parse(response.Body)
  }

  /**
   * Elaborate template data
   *
   * @param {Object} templateData
   * @returns {Promise}
   */
  elaborateTemplate (templateData) {
    delete templateData.Resources.ServerlessDeploymentBucket
    templateData.Parameters.ServerlessDeploymentBucket = {
      Type: 'String',
      Description: 'S3 Deployment Bucket',
      Default: this.destBucket
    }

    const shareConfig = {
      parameters: {},
      ...this.serverless.service.custom.share
    }

    for (const key in shareConfig.parameters) {
      const parameter = templateData.Parameters[key]
      if (parameter === undefined) {
        this.serverless.cli.log(`Rule ${key} cannot be applied, parameters not found`)
        continue
      }
      const rule = shareConfig.parameters[key]
      if (rule === 'required') {
        delete parameter.Default
      } else if (rule === 'optional') {
        parameter.Default = ''
      }
    }
    return templateData
  }

  /**
   * Save template
   *
   * @param {Object} templateData
   */
  async saveTemplate (templateData) {
    await this.provider.request('S3', 'putObject', {
      Bucket: this.destBucket,
      Key: 'template.json',
      ACL: 'public-read',
      ContentType: 'application/json',
      Body: JSON.stringify(templateData)
    }, this.options.stage, this.region)
  }

  /**
   * Download code
   *
   * @param {String} destPath
   */
  async downloadCode (destPath) {
    const response = await this.provider.request('S3', 'getObject', {
      Bucket: this.deploymentBucket,
      Key: path.join(this.latestVersion, this.archiveFileName)
    }, this.options.stage, this.region)

    fs.writeFileSync(destPath, response.Body)
  }

  /**
   * Upload code
   *
   * @param {String} srcPath
   */
  async uploadCode (srcPath) {
    await this.provider.request('S3', 'upload', {
      ACL: 'public-read',
      Bucket: this.destBucket,
      ContentType: 'application/zip',
      Key: path.join(this.latestVersion, this.archiveFileName),
      Body: fs.createReadStream(srcPath)
    }, this.options.stage, this.region)
  }
}

module.exports = ServerlessPlugin
