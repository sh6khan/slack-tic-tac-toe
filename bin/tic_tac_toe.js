'use strict'

require ('safestart')(__dirname + '/../');
const program = require('commander');
const app = require('../app');
const Config = require('../constants');

program
.option('--port [port]', 'listen on port')
.parse(process.argv);

let port = program.port || Config.PORT

if (!port) {
  return program.help();
}

const server = app.listen(port, function(){
  console.log('YAY !! Listening on port ' + port);
});
