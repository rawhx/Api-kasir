const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        barang_nama: { type: String, unique: true },
        barang_harga: { type: Number },
        barang_created_at: { type: Date, default: Date.now },
        barang_updated_at: { type: Date, default: null },
        barang_deleted_at: { type: Date, default: null },
    },
    { versionKey: false }
)

module.exports = mongoose.model("barang", schema)