
import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import './amplify-config'

process.env.NODE_ENV = 'test'