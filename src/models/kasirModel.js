const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        kasir_kode_invoice: { type: String },
        kasir_total_qty: { type: Number },
        kasir_total_harga: { type: Number },
        kasir_created_at: { type: Date, default: Date.now },
        kasir_updated_at: { type: Date, default: null },
        kasir_deleted_at: { type: Date, default: null },
    },
    { versionKey: false }
)

module.exports = mongoose.model("kasir", schema)