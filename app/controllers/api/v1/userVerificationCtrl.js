/**
 * @file contains request handler of user resource
*/

const {sendVerificationEmail, verifyEmail, sendForgotPassword, verifyPassword} = require("../../../services/userVerification")
const dotenv = require('dotenv')
dotenv.config();

module.exports = {

    sendVerificationEmail(req, res) {
        sendVerificationEmail(req).then(data => {
            if(!!data){
                res.status(200).json({
                    status: "OK",
                    message: "Verification email has been sent",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    verifyEmail(req, res) {
        verifyEmail(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Verify email success",
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    sendForgotPassword(req, res) {
        sendForgotPassword(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "An email has been sent",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    verifyPassword(req, res) {
        verifyPassword(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Reset Password success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },
}