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

        const dataa = await Promise.all(dataKasir.map(async (data) => {
            const detailBarang = await kasirDetail.find({ kasir_detail_kasir_id: data['_id'] });
            return { ...data.toObject(), kasir_detail_barang: detailBarang };
        }));

        Helper.Response(res, {
            message: 'Transaksi Berhasil Ditemukan',
            description: 'Berhasil menemukan data transaksi',
            data: dataa,
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

const KalkulateDetailItem = async (data) => {
    try {
        let total_harga = 0;
        let total_qty = 0;
        for (const element of data) {
            const { barang_harga } = await barang.findOne({ _id: element['barang_id'] });
            total_harga += element["barang_total_harga"] ? element["barang_total_harga"] : element['barang_qty'] * barang_harga
            total_qty += element["barang_total_harga"] ? element["barang_total_harga"] / barang_harga : element['barang_qty']
        }
        return { total_harga, total_qty }
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

const SaveDetail = (data, storeKasir = null, jenis = 'save') => {
    if(jenis == 'save') {
        data.forEach(async (element, key) => {
            const {barang_harga} = await barang.findOne({_id: element['barang_id']})
            const storeDetail = new kasirDetail({ 
                kasir_detail_kasir_id: storeKasir["_id"],
                kasir_detail_barang_id: element['barang_id'],
                kasir_detail_qty: element["barang_total_harga"] ?  element["barang_total_harga"] / barang_harga : element['barang_qty'],
                kasir_detail_harga: barang_harga,
                kasir_detail_subtotal: element["barang_total_harga"] ?  element["barang_total_harga"] : element['barang_qty'] * barang_harga
            })
            await storeDetail.save()
        })
    } else {
        let total_harga = 0;
        let total_qty = 0;
        data.forEach(async (element, key) => {
            total_harga += element["barang_total_harga"] ? element["barang_total_harga"] : element['barang_qty'] * barang_harga
            total_qty += element["barang_total_harga"] ? element["barang_total_harga"] / barang_harga : element['barang_qty']
            const {barang_harga} = await barang.findOne({_id: element['barang_id']})
            const storeDetail = await kasirDetail.findOneAndUpdate(
                {
                    kasir_detail_barang_id: element['barang_id']
                },
                {
                    kasir_detail_qty: element["barang_total_harga"] ?  element["barang_total_harga"] / barang_harga : element['barang_qty'],
                    kasir_detail_harga: barang_harga,
                    kasir_detail_subtotal: element["barang_total_harga"] ?  element["barang_total_harga"] : element['barang_qty'] * barang_harga,
                },
                { new: true }
            )
        })
        return { total_harga, total_qty }
    }
}

const Store = async (req, res) => {
    try {
        const request = req.body
        
        let date = new Date()
        date.setHours(0, 0, 0, 0, 0)

        let kasirFind = await kasir.countDocuments({kasir_created_at: { $gte: date }}) || 0

        let invoice = `EIT-${date.getDate() + '' + (date.getMonth() + 1) + '' + (date.getFullYear() % 100) + '' + (kasirFind + 1)}`

        const { total_harga, total_qty } = await KalkulateDetailItem(request.kasir_item)

        const storeKasir = new kasir({ 
            kasir_kode_invoice: invoice,
            kasir_total_qty: total_qty,
            kasir_total_harga: total_harga,
        })
        await storeKasir.save()

        const saveDetail = await SaveDetail(request.kasir_item, storeKasir)

        Helper.Response(res, {
            data: request.kasir_item
        })
    } catch (error) {
        Helper.ResponseError(res, {
            errorMessage: error
        })
    }
}

const Update = async (req, res) => {
    try {
        const request = req.body
        let kasirFind = await kasir.findOne({ _id: request.transaksi_id })
        if(!kasirFind) {
            Helper.ResponseError(res, {
                message: 'Permintaan Tidak Ditemukan',
                description: 'Data transaksi tidak tersedia',
            })
            return
        }
        const { total_harga, total_qty } = await SaveDetail(request.kasir_item, null, "update")
        const transaksiUpdate = await kasir.findOneAndUpdate(
            { _id: transaksi_id }, 
            {
                kasir_total_qty: total_qty,
                kasir_total_harga: total_harga,
                kasir_updated_at: new Date(),
            },
            { new: true },
        )

        Helper.Response(res, {
            data: transaksiUpdate
        })
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