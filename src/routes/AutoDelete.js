const { kasir, kasirDetail } = require("../models")

const AutoDelete = async () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const data = await kasir.find({ kasir_deleted_at: { $lte: thirtyDaysAgo } })
    const result = data.forEach(async (element, key) => {
        await kasirDetail.deleteMany({ kasir_detail_kasir_id: element['_id'] })
        const resultData = await kasir.deleteMany({ kasir_deleted_at: { $lte: thirtyDaysAgo } })
        return resultData
    })
}

module.exports = AutoDelete