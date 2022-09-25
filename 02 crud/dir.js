const fs = require('fs')

if(!fs.existsSync('./new')) {
    fs.mkdir('./new', (er) => {
        if(er) throw er
        console.log('directory created');
    })
}else console.log('file already exists');