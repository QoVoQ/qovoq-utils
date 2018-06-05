const express = require('express')
const expressWS = require('express-ws')
const opn = require('opn')
const ip = require('ip')

const PORT = 3476
const app = express()
expressWS(app)
const localAddr = `http://${ip.address()}:${PORT}/static`

app.use('/static', express.static('demo'))
app.use('/src', express.static('src'))

app.ws('/', (ws, req) => {
  ws.on('message', msg => {
    console.log(`From client: ${msg}`)
    ws.send('I got you, mate.')
  })
})

app.listen(PORT, () => {
  opn(localAddr)
})
