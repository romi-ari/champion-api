/**
* @file contains repository champion
*/


const {champion} = require("../models")

module.exports = {

    create(createArgs){
        return champion.create(createArgs)
    },

    update(id, updateArgs) {
        return champion.update(updateArgs, {
            where: {
                id,
            }
        })
    },

    delete(id) {
        return champion.destroy(id)
    },

    findByPk(id) {
        return champion.findByPk(id)
    },

    findOne(id) {
        return champion.findOne(id)
    },

    findAll() {
        return champion.findAll()
    },

    getTotalchampion() {
        return champion.count()
    }
}