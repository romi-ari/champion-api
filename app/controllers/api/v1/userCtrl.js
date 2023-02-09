/**
 * @file contains request handler of user resource
*/

const {list, registerAdmin, registerMember, listById, update, destroy, login, approved} = require("../../../services/userSvc")
const dotenv = require('dotenv')
dotenv.config();

module.exports = {

    list(req, res) {
        list(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "List user success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    registerAdmin(req, res) {
        registerAdmin(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Register user success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    registerMember(req, res) {
        registerMember(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Register user success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    listById(req, res) {
        listById(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "List user by id success",
                    data,
                })
            }
        }).catch(err => {

            res.status(400).json({
                error: err.message
            })
        })
    },

    update(req, res) {
        update(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Update user success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    destroy(req, res) {
        destroy(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Delete success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    login(req, res) {
        login(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Login success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    approved(req, res) {
        approved(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Approved success",
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