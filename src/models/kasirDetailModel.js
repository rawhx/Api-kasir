const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        kasir_detail_kasir_id: { type: String },
        kasir_detail_barang_id: { type: String },
        kasir_detail_qty: { type: Number },
        kasir_detail_harga: { type: Number },
        kasir_detail_subtotal: { type: Number },
    },
    { versionKey: false }
)

module.exports = mongoose.model("kasirDetail", schema)