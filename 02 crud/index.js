// const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')



const fileOps = async () => {
    try {
        const data = await fsPromise.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8')
        console.log(data);
        await fsPromise.unlink(path.join(__dirname, 'files', 'starter.txt')) //delete starter.txt
        await fsPromise.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data) //create a new file promiseWrite.txt and append data [data is in a variable now]
        await fsPromise.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\nwriting new promise data') // appending new data to the file
        await fsPromise.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseWriteComplete.txt')) //renaming the file only after completing the appending
        const newData = await fsPromise.readFile(path.join(__dirname, 'files', 'promiseWriteComplete.txt'), 'utf-8')
        console.log(newData);

    } catch (err) {
        console.log(err)
    }
}

fileOps()



// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8',(err, data) => {
//     if(err) throw err
//     console.log(data);
// })

// fs.writeFile(path.join(__dirname, 'files', 'starter.txt'), 'replies complete', (err) => {
//     if(err) throw err
//     console.log('writing complete');

//     fs.appendFile(path.join(__dirname, 'files', 'starter.txt'), '\nreplies appended', (er) => {
//         if(er) throw er
//         console.log('appending colmplete');
//     })
// })


process.on('uncaughtException', err => {
    console.log('there was an uncaught exception', err)
    process.exit(1)
})