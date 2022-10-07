/*
working: GET
1: server creates a local server using http and name the functions as 'server'
2: listents to any emit events
3: 'server' functions listens on the port for any requests:
    3.1: it gets file requests from the user, logs the data to reqLog.txt
    3.2: sets the contentType by checking the extention of the file from request url
    3.3: sets the filePath with respect to the content type
    3.4: check if file exits
        3.4.1: serve file
        3.4.2: redirect to 404 page
*/


const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises
// const logEvents = require('./logEvents')
const EventEmitter = require('events') 
const logEvents = require('./logEvents')


class Emitter extends EventEmitter {}
const myEmitter = new Emitter()

//2
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

const PORT = process.env.PORT || 3000


//serve the asked file
const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            // path.parse(filePath).ext != '.html' ?  '' : 'utf-8'
            !contentType.includes('image') ? 'utf-8' : '' //image does not go with utf-8, so blank
        )
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, //a switch statement would be better
            {'Content-Type' :  contentType}
        )
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data)
    } catch (er) { 
        console.log(er)
        myEmitter.emit('log', `${er.name}: ${er.message}`, 'error.txt')
        response.statusCode = 500
        response.end()
    }
}


//1: server
// 2.1
const server = http.createServer((req, res) => {

    const extention = path.extname(req.url)
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')


    let contentType;

    //3.2
    switch(extention) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.png': contentType = 'image/png'; break;
        case '.txt': contentType = 'text/plain'; break;
        default: contentType = 'text/html'; break;
    }

    //3.3
    if(contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'views', 'index.html')
        console.log('1',filePath)
    }else if(contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, req.url, 'index.html')
        console.log('2',filePath)
    }else if(contentType === 'text/html') {
        filePath = path.join(__dirname, 'views', req.url)
        console.log('3',filePath)
    }else {
        filePath = path.join(__dirname, req.url)
        console.log('4',filePath)
    }
                    
    if(!extention && req.url.slice(-1) != '/') filePath += '.html' //if the user didn't type 'fileName.html', automaticaly adds .html to the end

    const fileExits = fs.existsSync(filePath) //checking if the file exits. returns boolean

    //3.4
    if(fileExits) {
        serveFile(filePath, contentType, res) //3.4.1
    }else {
        console.log('redirect',fileExits, path.parse(filePath).base);
        switch(path.parse(filePath).base) {
            case 'old-page.html' : 
                serveFile(path.join(__dirname, 'views', 'new-page.html'), 'text/html', res);
                break;
            case 'data.html' : 
                serveFile(path.join(__dirname, 'data', 'data.html'), 'text/html', res);
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res); //3.4.2
                break;

        }
    }

})

//3
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

