/* eslint-disable unicorn/no-process-exit */

import http from 'node:http'

import debug from 'debug'
import exitHook from 'exit-hook'

import { app } from '../app.js'
import * as configFunctions from '../helpers/configFunctions.js'
const debugWWW = debug('contract-expiration-tracker:www')

let httpServer: http.Server

interface ServerError extends Error {
  syscall: string
  code: string
}

const onError = (error: ServerError): void => {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': {
      debugWWW('Requires elevated privileges')
      process.exit(1)
    }
    // break;

    case 'EADDRINUSE': {
      debugWWW('Port is already in use.')
      process.exit(1)
    }
    // break;

    default: {
      throw error
    }
  }
}

const onListening = (server: http.Server): void => {
  const addr = server.address()

  const bind =
    typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port.toString()}`

  debugWWW(`Listening on ${bind}`)
}

/**
 * Initialize HTTP
 */

const httpPort = configFunctions.getProperty('application.httpPort')

if (httpPort) {
  httpServer = http.createServer(app)

  httpServer.listen(httpPort)

  httpServer.on('error', onError)
  httpServer.on('listening', () => {
    onListening(httpServer)
  })

  debugWWW(`HTTP listening on ${httpPort.toString()}`)
}

exitHook(() => {
  if (!httpServer) {
    return
  }

  debugWWW('Closing HTTP')
  httpServer.close()
  httpServer = undefined
})
