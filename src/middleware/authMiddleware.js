const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        // Mendapatkan token dari header Authorization
        const token = req.headers.authorization;

        const tokenWithoutBearer = token.split(' ')[1];

        const key = process.env.API_KEY;
        // Memverifikasi token JWT
        const decode = jwt.verify(tokenWithoutBearer, key)
        req.user = decode
        next()
    } catch (error) {
        console.log('====================================');
        console.error('Error during authorization:', error);
        console.log('====================================');
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
