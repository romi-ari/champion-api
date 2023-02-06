/**
 * @file contains request handler of champion resource
*/

const {list, registerChampion, listById, update, destroy} = require("../../../services/championSvc")
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
                    message: "List champion success",
                    data,
                })
            }
        }).catch(err => {
            res.status(400).json({
                error: err.message
            })
        })
    },

    registerChampion(req, res) {
        registerChampion(req).then(data => {
            if(data.response){
                res.status(data.response).json({
                    status: data.status,
                    message: data.message,
                    error: data.error,
                })
            }else{
                res.status(200).json({
                    status: "OK",
                    message: "Register champion success",
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
                    message: "List champion by id success",
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
                    message: "Update champion success",
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

}