const bcrypt = require('bcrypt');
const { user: UserModels } = require('./../models');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Helper = require('../../Helpers/helper');
require('dotenv').config();

const Register = async (req, res) => {
    try {
        const request = req.body

        const userFind = await UserModels.findOne({ user_email: request.user_email })
        if (!request.user_email || !validator.isEmail(request.user_email) || !request.user_password || !request.user_confirmPassword) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Permintaan tidak dapat diproses karena ada data yang hilang atau tidak valid!"
            });
        } 
        if (userFind) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Email sudah digunakan!"
            });
        }
        if (request.user_password !== request.user_confirmPassword) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Kata sandi tidak sesuai!"
            });
        }
    
        const hashedPassword = await bcrypt.hash(request.user_password, 10)
        const payload = { user_email: request.user_email, user_password: hashedPassword, user_created_at: new Date() }

        const user = new UserModels(payload)
        await user.save()
        return Helper.Response(res, {
            message: 'Registrasi Berhasil',
            description: 'Berhasil melakukan registrasi!',
            data: user
        })
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }    
}

const Login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body
        if (!user_email || !validator.isEmail(user_email) || !user_password) {
            return Helper.ResponseError(res, {
                code: 400,
                message: 'Bad Request',
                description: "Permintaan tidak dapat diproses karena ada data yang hilang atau tidak valid!"
            })
        } 

        const user = await UserModels.findOne({ user_email })
        if (!user) {
            return Helper.ResponseError(res, { 
                code: 401,
                message: 'Invalid Request',
                description: 'Email tidak tersedia!',
            });
        }
        const passwordMatch = await bcrypt.compare(user_password, user.user_password);
        if (!passwordMatch) {
            return Helper.ResponseError(res, { 
                code: 401,
                message: 'Invalid Request',
                description: 'kata sandi tidak sesuai!',
            });
        }

        const key = process.env.API_KEY;
        const token = jwt.sign({ user_id: user._id, user_email: user.user_email }, key, { expiresIn: '3d' });

        return Helper.Response(res, {
            message: 'Login Berhasil',
            description: 'Berhasil login!',
            data: token
        })
        
    } catch (error) {
        return Helper.ResponseError(res, {
            errorMessage: error.message
        })
    }
}

module.exports = {
    Register, Login
}