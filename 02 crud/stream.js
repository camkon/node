const fs = require('fs')

const readStream = fs.createReadStream('./files/lorem.txt', {encoding: 'utf-8'})

const writeStream = fs.createWriteStream('./files/new-lorem.txt')

// readStream.on('data', (dataChunk) => {
//     writeStream.write(dataChunk)
// })

readStream.pipe(writeStream)