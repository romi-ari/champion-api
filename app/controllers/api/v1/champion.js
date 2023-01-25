/**
 * @file contains request handler of post resource
 */
const { champion } = require("../../../models");
const dotenv = require('dotenv')
dotenv.config();

module.exports = {

  async list(req, res) {
    try {
      const championList = await champion.findAll();
      
      res.status(200).json({
        status: "OK",
        message: "List champion data success",
        data: {
          championList,
        },
      });
    }
    catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: `List champion failed, ${err.message}`,
      });
    };
  },

  async create(req, res) {
    try{
      const name = req.body.name
      const title = req.body.title
      const description = req.body.description
      const role = req.body.role
      const difficulty = req.body.difficulty
      
      const create = await champion.create({
        name,
        title,
        description,
        role,
        difficulty,
      })
      res.status(201).json({
        status: "OK",
        message: "Register champion success",
        data: create,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Register champion failed, ${err.message}`,
      });
    };
  },

  async update(req, res) {
    try {
      const name = req.body.first_name
      const title = req.body.last_name
      const description = req.body.username
      const role = req.body.address
      const difficulty = req.body.phone
      
      req.champion = await champion.findByPk(req.params.id)
      const champions = await req.champion.update({
        name,
        title,
        description,
        role,
        difficulty,
      })
      res.status(200).json({
        status: "OK",
        message: "Update champion data success",
        data: champions,
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Data failed to update, ${err.message}`,
      });
    };
  },

  async showById(req, res) {
    try{
      const showChampionById = await champion.findByPk(req.params.id);
  
      res.status(200).json({
        status: "OK",
        message: "Show data by id success",
        data: showChampionById,
      });
    }
    catch (err) {
      res.status(404).json({
        status: "FAIL",
        message: `Data not found, ${err.message}`,
      });
    };
  },

  async destroy(req, res) {
    try{
      req.champion = await champion.findByPk(req.params.id)
      const remove = await req.champion.destroy()

      res.status(200).json({
        status: "OK",
        message: "Data deleted success",
      });
    }
    catch (err) {
      res.status(422).json({
        status: "FAIL",
        message: `Delete Failed, (${err.message})`,
      });
    }
  },
};
