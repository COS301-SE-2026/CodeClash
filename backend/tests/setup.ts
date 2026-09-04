<<<<<<< HEAD

import dotenv from 'dotenv'
dotenv.config({path: '.env.test'})

import '../src/frameworks-drivers/config/amplify-config'

=======

import dotenv from 'dotenv'
dotenv.config();

import '../src/frameworks-drivers/config/amplify-config'

>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
process.env.NODE_ENV = 'test'