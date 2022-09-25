const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises
// const logEvents = require('./logEvents')
const EventEmitter = require('events') 


class Emitter extends EventEmitter {}
const myEmitter = new Emitter()

const PORT = process.env.PORT || 3500


const serveFile = async (filePath, contentType, response) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8')
        response.writeHead()
    } catch (er) { 
        console.log(er)
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    const extention = path.extname(req.url)

    let contentType;

    switch(extention) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.png': contentType = 'image/png'; break;
        case '.txt': contentType = 'text/plain'; break;
        default: contentType = 'text/html'; break;
    }

    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url)
                    
    if(!extention && req.url.slice(-1) != '/') filePath += '.html'

    const fileExits = fs.existsSync(filePath)

    if(fileExits) {
        // send file
    }else {
        console.log(path.parse(filePath))
        res.writeHead(301, {'Location': '/404.html'})
        res.end()
    }
 
    // if(req.url === '/' || req.url === 'index.html') {
    //     req.statusCode = 200
    //     res.setHeader('Content-type', 'text/html')
    //     path = path.join(__dirname, 'views', 'index.html')
    //     fs.readFile(path, 'utf-8', (er, data) => {
    //         if(er) throw er
    //         res.end(data)
    //     })
    // }else {
    //     req.statusCode = 404
    //     res.setHeader('Content-type', 'text/html')
    //     path = path.join(__dirname, 'views', '404.html')
    //     fs.readFile(path, 'utf-8', (er, data) => {
    //         if(er) throw er
    //         res.end(data)
    //     })
    // }

    // switch(req.url) {
    //     case '/' : 
    //         req.statusCode = 200
    //         res.setHeader('Content-type', 'text/html')
    //         path = path.join(__dirname, 'views', 'index.html')
    //         fs.readFile(path, 'utf-8', (er, data) => {
    //             if(er) throw er
    //             res.end(data)
    //         })
    //         break;
    //     default: 
    //         req.statusCode = 404
    //         res.setHeader('Content-type', 'text/html')
    //         path = path.join(__dirname, 'views', '404.html')
    //         fs.readFile(path, 'utf-8', (er, data) => {
    //             if(er) throw er
    //             res.end(data)
    //         })
    //         break;
    // }
})

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})



