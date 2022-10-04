import express, { Express, Request, Response } from 'express'

const server: Express = express()

server.all('/', (req: Request, res: Response) => {
  res.send('serving keepalive with express')
})

server.get('/healthcheck', (req: Request, res: Response) => {
  res.send('ok')
})

server.get('/version', (req: Request, res: Response) => {
  res.send('0.0.2')
})

export function keepAlive() {
  server.listen(process.env.PORT || 3000, () => {
    console.log('Server is Ready!!' + Date.now())
  })
}
