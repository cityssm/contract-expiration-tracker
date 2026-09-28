import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

import * as configFunctions from './helpers/configFunctions.js'

const __dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: configFunctions.getProperty('customizations.applicationName'),
  description:
    'A tool to track expirations of procurement projects and/or contracts.',
  script: path.join(__dirname, 'bin', 'www.js')
}
