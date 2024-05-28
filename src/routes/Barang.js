const express = require("express");
const { BarangController } = require('./../controllers');

const Barang = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/barang');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

Barang.get('/', BarangController.View);
Barang.post('/',  multer({ storage: storage, fileFilter: imageFilter }).single('barang_gambar'), BarangController.Store);
Barang.patch('/', multer({ storage: storage, fileFilter: imageFilter }).single('barang_gambar'), BarangController.Update);
Barang.delete('/', BarangController.Delete);

module.exports = Barang