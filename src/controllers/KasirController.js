const { kasir, kasirDetail, barang } = require('../models');
const Helper = require('./../../Helpers/helper');

const View = async (req, res) => {
    try {
        const { kasir_id, kasir_invoice, kasir_tanggal_awal, kasir_tanggal_akhir, limit, page } = req.body
        
        const limitt = parseInt(limit) || 10
        const pagee = parseInt(page) || 1
        const skip = (pagee - 1) * limitt

        const find = { 
            kasir_deleted_at: null 
        } 
        if (kasir_id) find._id = kasir_id
        if (kasir_invoice) find.kasir_kode_invoice = kasir_invoice
        if (kasir_tanggal_awal && kasir_tanggal_akhir) {
            find.kasir_created_at = { $gte: kasir_tanggal_awal, $lte: kasir_tanggal_akhir }
        }

        const dataKasir = await kasir.find(find).sort({ kasir_created_at: 1 }).limit(limitt).skip(skip)
        const countKasir = await kasir.countDocuments({kasir_deleted_at: null}) || 0

        dataKasir.forEach(async (data, key) => {
            const detailBarang = await kasirDetail.find({ kasir_detail_kasir_id: data['_id'] });
            dataKasir[key].kasir_detail_barang = detailBarang 
        })

        Helper.Response(res, {
            message: 'Transaksi Berhasil Ditemukan',
            description: 'Berhasil menemukan data transaksi',
            data: dataKasir,
            count: countKasir, 
            page: pagee,
            limit: limitt
        })
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

const Store = async (req, res) => {
    try {
        const request = req.body
        
        let date = new Date()
        date.setHours(0, 0, 0, 0, 0)

        let kasirFind = await kasir.countDocuments({kasir_created_at: { $gte: date }}) || 0

        let invoice = `EIT-${date.getDate() + '' + (date.getMonth() + 1) + '' + (date.getFullYear() % 100) + '' + (kasirFind + 1)}`

        const storeKasir = new kasir({ 
            kasir_kode_invoice: invoice,
            kasir_total_qty: request.kasir_qty,
            kasir_total_harga: request.kasir_total,
        })
        await storeKasir.save()

        request.kasir_item.forEach(async (element, key) => {
            const {barang_harga} = await barang.findOne({_id: element['barang_id']})
            const storeDetail = new kasirDetail({ 
                kasir_detail_kasir_id: storeKasir["_id"],
                kasir_detail_barang_id: element['barang_id'],
                kasir_detail_qty: element['barang_qty'],
                kasir_detail_harga: barang_harga,
                kasir_detail_subtotal: element['barang_qty'] * barang_harga
            })
            await storeDetail.save()
        })

        Helper.Response(res, {
            data: request.kasir_item
        })
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

const Update = (req, res) => {
    try {
        
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

const Delete = async (req, res) => {
    try {
        const { transaksi_id } = req.body

        const transaksiDelete = await kasir.findOneAndUpdate(
            { _id: transaksi_id }, 
            {
                kasir_updated_at: new Date(),
                kasir_deleted_at: new Date()
            },
            { new: true },
        )

        Helper.Response(res, {
            message: 'Transaksi Berhasil Dihapus',
            description: 'Berhasil menghapus transaksi',
            data: {
                transaksi_id: transaksi_id
            }
        })
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

module.exports = {
    View, Store, Update, Delete
}