/**
* @file contains express.js server
*/

const express = require("express")
const app = express()

const logger = require("morgan")
const router = require("../config/routes")

/** Install request logger */
app.use(logger("dev"));

/** Install JSON request parser */
app.use(express.json());

/** Install Router */
app.use(router);

module.exports = app;