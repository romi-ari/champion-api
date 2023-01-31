/**
* @file contains repository user 
*/


const {user} = require("../models")

module.exports = {

    create(createArgs){
        return user.create(createArgs)
    },

    update(id, updateArgs) {
        return user.update(updateArgs, {
            where: {
                id,
            }
        })
    },

    delete(id) {
        return user.destroy(id)
    },

    findByPk(id) {
        return user.findByPk(id)
    },

    findOne(id) {
        return user.findOne(id)
    },

    findAll() {
        return user.findAll()
    },

    getTotalUser() {
        return user.count()
    }
}