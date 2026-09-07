
import dotenv from 'dotenv'
dotenv.config({path: '.env.test'})

import '../src/frameworks-drivers/config/amplify-config'

process.env.NODE_ENV = 'test'