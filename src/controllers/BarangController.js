const Helper = require("../../Helpers/helper")
const { barang } = require("../models")

const View = async (req, res) => {
    try {
        const { barang_id, barang_nama, barang_harga, limit, page } = req.body
        const find = { 
            barang_deleted_at: null 
        } 
        if (barang_id) {
            find._id = barang_id 
        }
        if (barang_nama) {
            find.barang_nama = barang_nama 
        }
        if (barang_harga) {
            find.barang_harga = barang_harga 
        }
        const limitt = parseInt(limit) || 10
        const pagee = parseInt(page) || 1
        const skip = (pagee - 1) * limitt
        const dataBarang = await barang.find(find).sort({ barang_created_at: 1 }).limit(limitt).skip(skip)
        const countBarang = await barang.countDocuments({barang_deleted_at: null})
        return Helper.Response(res, {
            message: 'Barang Berhasil Ditemukan',
            description: 'Berhasil menemukan data barang',
            data: dataBarang,
            count: countBarang || 0, 
            page: pagee || 1,
            limit: limitt || 10
        })
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }
}

const Store = async (req, res) => {
    try {
        const request = req.body
        if (!request.barang_nama) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "nama barang wajib diisi!"
            })
        }
        if (!request.barang_harga) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "harga barang wajib diisi!"
            })
        }

        const barangFind = await barang.findOne({barang_nama: request.barang_nama})
        if (barangFind) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Nama barang sudah tersedia!"
            })
        }

        const storeBarang = new barang({ 
            barang_nama: request.barang_nama, 
            barang_harga: request.barang_harga 
        })
        await storeBarang.save()

        return Helper.Response(res, {
            message: 'Barang Berhasil Ditambahkan',
            description: 'Berhasil menambahkan data barang',
            data: storeBarang
        })
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }
}

const Update = async (req, res) => {
    try {
        const request = req.body
        const barangFind = await barang.findOne({barang_nama: request.barang_nama})
        if (barangFind && request.barang_id != barangFind._id) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Nama barang sudah tersedia!"
            })
        }
        const response = await barang.findOneAndUpdate(
            { _id: request.barang_id }, 
            {
                barang_nama: request.barang_nama,
                barang_harga: request.barang_harga,
                barang_updated_at: new Date(),
            },
            { new: true }
        );
        Helper.Response(res, {
            message: 'Barang Berhasil Diperbarui Data',
            description: 'Berhasil memperbarui barang',
            data: response
        })
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }
}

const Delete = async (req , res) => {
    try {
        const { barang_id } = req.body
        if (!barang_id) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Pilih barang yang ingin dihapus!"
            })
        }

        const barangFind = await barang.findOne({_id: barang_id})
        if (barangFind.barang_deleted_at) {
            await barang.deleteOne(
                {_id: barang_id}
            )
            Helper.Response(res, {
                message: 'Barang Berhasil Dihapus Permanen',
                description: 'Berhasil menghapus barang secara permanen ',
                data: {
                    barang_id: barang_id
                }
            })
            return
        }
        const barangDelete = await barang.findOneAndUpdate(
            { _id: barang_id }, 
            {
                barang_updated_at: new Date(),
                barang_deleted_at: new Date()
            },
            { new: true },
        )
        return Helper.Response(res, {
            message: 'Barang Berhasil Dihapus',
            description: 'Berhasil menghapus barang',
            data: {
                barang_id: barang_id
            }
        })
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }
}

module.exports = {
    View, Store, Update, Delete
}