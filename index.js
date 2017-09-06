const port = 3000
const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()


const options = {
    key: fs.readFileSync(__dirname + '/key/server.key'),
    cert: fs.readFileSync(__dirname + '/key/server.crt')
}
app.get('/demo.html', (req, res) => {
    res.end(fs.readFileSync('./public/demo.html'))
})
app.get('/', (req, res) => {
    var stream = res.push('/main.js', {
        status: 200, // optional
        method: 'GET', // optional
        request: {
            accept: '*/*'
        },
        response: {
            'content-type': 'application/javascript'
        }
    })
    stream.on('error', function() {})
    // stream.end('alert("hello from push stream!");')
    stream.end(fs.readFileSync('./public/main.js'))

    res.end(fs.readFileSync('./public/index.html'))
})

app.use('/', express.static(path.join(__dirname, 'public')))

spdy
    .createServer(options, app)
    .listen(port, (error) => {
        if (error) {
            console.error(error)
            return process.exit(1)
        } else {
            console.log('Listening on port: ' + port + '.')
        }
    })
