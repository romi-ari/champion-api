/**
* @file contains repository user 
*/


const {user} = require("../models")

module.exports = {

    findByEmail(email){
        return user.findOne(
            {where: {email} }
        )
    },

    findByVerificationToken(verification_token){
        console.log("Masuk repo 1")
        return user.findOne(
            {where: {verification_token} }
        )
    },

    // update(user){
    //     return user.save()
    // },
    
    update(id, updateArgs) {
        return user.update(updateArgs, {
            where: {
                id,
            }
        })
    },
}