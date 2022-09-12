const express = require('express')
const server = express()

server.all('/', (req, res) => {
  res.send('serving keepalive with express')
})

server.get('/healthcheck', (req, res) => {
  res.send('ok')
})

server.get('/version', (req, res) => {
  res.send('0.0.1')
})

function keepAlive() {
  server.listen(3000, () => {
    console.log('Server is Ready!!' + Date.now())
  })
}

module.exports = keepAlive
