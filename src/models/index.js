const mongoose = require('mongoose');

module.exports = {
    user: require('./userModel.js'),
    barang: require('./barangModel.js'),
    kasir: require('./kasirModel.js'),
    kasirDetail: require('./kasirDetailModel.js'),
}