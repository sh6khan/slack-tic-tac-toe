'use strict'

require ('safestart')(__dirname + '/../');
const program = require('commander');
const app = require('../app');

program
.option('--port [port]', 'listen on port')
.parse(process.argv);

let port = program.port;

if (!port) {
  return program.help();
}

const server = app.listen(port, function(){
  console.log('YAY !! ');
});
