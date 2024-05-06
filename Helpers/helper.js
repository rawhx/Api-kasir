const Helper = {
    Response: (res, data) => {
        const response = {
            error: false,
            code: 200,
            message: data.message || 'Success',
            description: data.description || null,
            data: data.data || null
        }
        if(data.count || data.count == 0) response.count = data.count 
        if(data.page) response.page = data.page 
        if(data.limit) response.limit = data.limit 
        return res.json(response)
    },

    ResponseError: (res, data) => {
        const response = {
            error: true,
            code: data.code || 500,
            message: data.message || 'Internal Server Error',
            description: data.description || 'Permintaan tidak dapat diproses karena terjadi kesalahan pada server.',
        }

        if (data.errorMessage) response.errorMessage = data.errorMessage

        return res.status( data.code || 500 ).json(response)
    }
}

module.exports = Helper