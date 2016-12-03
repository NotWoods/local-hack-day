var deepstream = require('deepstream.io-client-js')
var client = deepstream('localhost:6020').login()
var record = client.record.getRecord('some-name')

record.set('first', function (value) {

})


