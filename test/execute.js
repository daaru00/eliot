const Mocha = require('mocha')
const mocha = new Mocha({
  bail: true,
  timeout: 6000
})
const glob = require('glob')

const TEST_DIR = __dirname

glob.sync(`${TEST_DIR}/**/*.js`).filter((file) => file !== __filename).forEach(function (file) {
  mocha.addFile(file)
})

exports.handler = (event, context, callback) => {
  mocha.reporter('list').run(function (failures) {
    if (failures === 0) {
      callback(null, 'all tests passed successfully')
    } else {
      // eslint-disable-next-line standard/no-callback-literal
      callback(`${failures} tests fails`)
    }
  })
}
