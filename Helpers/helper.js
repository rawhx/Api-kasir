const Helper = {
    Response: (res, data) => {
        return res.json({
            error: false,
            code: 200,
            message: data.message || 'Success',
            description: data.description || null,
            data: data.data || null
        })
    },

    ResponseError: (res, data) => {
        const response = {
            error: true,
            code: data.code || 500,
            message: data.message || 'Internal Server Error',
            description: data.description || 'Permintaan tidak dapat diproses karena terjadi kesalahan pada server.',
        }

        if (data.errorMessage) reponse.errorMessage = data.errorMessage

        return res.status( data.code || 500 ).json(response)
    }
}

module.exports = Helper