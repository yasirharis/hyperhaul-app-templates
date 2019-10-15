var uncss = require('uncss')

var files = [
      'http://localhost:4200/'
  ]

uncss(files, function (error, output) {
  console.log('output:',output)
})
