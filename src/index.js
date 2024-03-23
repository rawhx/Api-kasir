const express = require('express')
require('dotenv').config()
const { configDatabase } = require('./config');

const App = express()
const PORT = process.env.PORT_API;

App.get('/', async (req, res) => {
    const db = await configDatabase()
    const user = await db.collection('users')
    const users = await user.findOne({user_nama: 'superAdmin'})
    return res.json({
        data: users
    })
})

App.listen(PORT, ()=>{
    console.log('====================================');
    console.log(`success running server in ${PORT}`)
    console.log('====================================');
})