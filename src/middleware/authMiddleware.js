const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        // Mendapatkan token dari header Authorization
        const token = req.headers.authorization;

        const tokenWithoutBearer = token.split(' ')[1];

        const key = process.env.API_KEY;
        // Memverifikasi token JWT
        jwt.verify(tokenWithoutBearer, key, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        error: true,
                        code: 401,
                        message: 'Unauthorized',
                        description: 'Token telah kedaluwarsa!',
                    })
                } else {
                    return res.status(401).json({
                        error: true,
                        code: 401,
                        message: 'Unauthorized',
                        description: 'Token tidak valid!',
                    })
                }
            } else {
                // Jika token valid, simpan informasi pengguna yang terdekripsi ke dalam objek req.user
                req.user = decoded;
                next(); // Lanjut ke middleware atau handler berikutnya
            }
        })
    } catch (error) {
        console.error('Error during authorization:', error);
        return res.status(500).json({
            error: true,
            code: 500,
            message: 'Internal Server Error',
            description: 'Terjadi kesalahan pada server.',
            errorMessage: error.message,
        });
    }
};

module.exports = authMiddleware;
