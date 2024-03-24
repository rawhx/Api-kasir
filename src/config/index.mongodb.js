const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const database = process.env.MONGO_DATABASE;

const client = new MongoClient(uri);

async function configDatabase() {
    try {
        await client.connect();
        console.log('====================================');
        console.log('Berhasil terhubung ke database');
        console.log('====================================');
        return client.db(database);
    } catch (error) {
        console.error('====================================');
        console.error('Gagal terhubung ke database');
        console.error(error);
        console.error('====================================');
        throw error;
    }
}

module.exports = { configDatabase }
