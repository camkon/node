const { format } = require('date-fns');
const  {v4: uuid} = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if(!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'logEvents.txt'), logItem)
    } catch(er) {console.log(er)}
}

console.log(`date and time : ${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`)
console.log(`uuid : ${uuid()}`)


module.exports = logEvents;
