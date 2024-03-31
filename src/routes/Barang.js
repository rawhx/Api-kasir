const express = require("express");
const { BarangController } = require('./../controllers');

const Barang = express.Router();

Barang.get('/', BarangController.View);
Barang.post('/', BarangController.Store);
Barang.patch('/', BarangController.Update);
Barang.delete('/', BarangController.Delete);

module.exports = Barang