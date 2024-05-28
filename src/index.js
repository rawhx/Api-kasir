const express = require('express')
require('dotenv').config()
const { configDatabase } = require('./config');
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const { Auth, Barang, Menu, Kasir, AutoDelete } = require('./routes');
const Helper = require('./../Helpers/helper');

const App = express()
const PORT = process.env.PORT_API;

App.get('/', (req, res)=>{
    const request = req.user
    Helper.Response(res, {
        description: 'Welcome to API Chasier👋'
    })
})

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(middleware.apiKey)

setInterval(AutoDelete, 24 * 60 * 60 * 1000);

App.use('/auth', Auth)

App.use(middleware.authMiddleware)

App.use('/menu', Menu)

App.use('/barang', Barang)

App.use('/kasir', Kasir)

App.listen(PORT, ()=>{
    console.log('====================================');
    console.log(`success running server in ${PORT}`)
    console.log('====================================');
    // connect database
    configDatabase()
})