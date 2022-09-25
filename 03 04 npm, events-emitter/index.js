const logEvents = require('./logEvents')

const EventEmitter = require('events') //package

class MyEmitter extends EventEmitter {} //instance of the imported package: MyEmitter

const myEmitter = new MyEmitter() //object of the instance class MyEmitter

// myEmitter.on('log', (msg) => logEvents(msg)) //listening for log event

// setTimeout(() => { //emmiting the log event
//     myEmitter.emit('log', 'log event emitted')
// }, 2000);
