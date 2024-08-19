const express = require('express')
require('dotenv').config()
const { configDatabase } = require('./config');
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const { Auth, Barang, Menu, Kasir, AutoDelete } = require('./routes');
const Helper = require('./../Helpers/helper');

const App = express()
const PORT = process.env.PORT_API
const PUBLIC = process.env.IP_PUBLIC || '127.0.0.1'

App.get('/', (req, res)=>{
    const request = req.user
    Helper.Response(res, {
        description: 'Selamat datang di API Kasir👋',
        data: {
            creator: {
                name: 'rawh',
                email: 'achmadhasbil24@gmail.com',
                linkedin: 'linkedin.com/in/achmad-hasbil-479623270/'
            }
        }
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

App.listen(PORT, PUBLIC, ()=>{
    console.log('====================================');
    console.log(`success running server in ${PUBLIC + ':' + PORT}`)
    console.log('====================================');
    // connect database
    configDatabase()
})