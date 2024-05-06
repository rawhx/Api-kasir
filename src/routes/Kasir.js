const express = require("express");
const { KasirController } = require('./../controllers');

const Kasir = express.Router();

Kasir.get('/', KasirController.View);
Kasir.post('/', KasirController.Store);
Kasir.patch('/', KasirController.Update);
Kasir.delete('/', KasirController.Delete);

module.exports = Kasir