/**
* @file contains repository user 
*/


const {user} = require("../models")
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = {

    findByEmail(email) {
        return user.findOne(
            {where: {email} }
        )
    },

    createToken(payload) {
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