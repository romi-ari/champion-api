const userService = require("./userSvc")
const championSvc = require("./championSvc")
const mid = require("./middleware")
const userVerification  = require("./userVerification")
const uploadFile  = require("./uploadFile")


module.exports = {
    userService,
    championSvc,
    mid,
    userVerification,
    uploadFile,
}