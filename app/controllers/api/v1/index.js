/**
 * @file contains entry point of controllers api v1 module
 */

const champion = require("./champion");
const admin = require("./admin");
const member = require("./member");
const someFunction = require("./someFunction");

module.exports = {
  champion,
  admin,
  member,
  someFunction
};
