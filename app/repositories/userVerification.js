/**
* @file contains repository user 
*/


const {user, verification} = require("../models")
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = {

    findByEmail(email) {
        return user.findOne(
            {where: {email} }
        )
    },

    findEmailToken(verify_email_token) {
        return verification.findOne(
            {where: {verify_email_token}}
        )
    },

    findPasswordToken(forgot_password_token) {
        return verification.findOne(
            {where: {forgot_password_token}}
        )
    },

    create(createArgs) {
        return verification.create(createArgs)
    },

    createTokenSendVerifyEmail(payload) {
        return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY);
    },
    
    createTokenForgotPassword(payload) {
        return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY, {expiresIn: "30min"});
    },

    update(id, updateArgs) {
        return user.update(updateArgs, {
            where: {
                id,
            }
        })
    },
    updateByEmail(email, updateArgs) {
        return user.update(updateArgs, {
            where: {
                email,
            }
        })
    },
}