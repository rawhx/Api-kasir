const express = require('express')
require('dotenv').config()
const { configDatabase } = require('./config');
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const { Auth } = require('./routes');
const Helper = require('./../Helpers/helper');

const App = express()
const PORT = process.env.PORT_API;

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(middleware.apiKey)

App.use('/auth', Auth)

App.use(middleware.authMiddleware)
App.get('/', (req, res)=>{
    const request = req.user
    Helper.Response(res, {
        data: request
    })
})

App.listen(PORT, ()=>{
    console.log('====================================');
    console.log(`success running server in ${PORT}`)
    console.log('====================================');
    // connect database
    configDatabase()
})