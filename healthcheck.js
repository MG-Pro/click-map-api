import http from 'http'

const options = {
  timeout: 2000,
  host: '127.0.0.1',
  port: 3000,
}

const request = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1)
})

request.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

request.end()
