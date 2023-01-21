/**
 * @file contains request handler of post resource
 */
const { champion } = require("../../../models");

module.exports = {
  list(req, res) {
    champion.findAll()
      .then((champions) => {
        res.status(200).json({
          status: "OK",
          data: {
            champions,
          },
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  create(req, res) {
    champion.create({
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      role: req.body.role,
      difficulty: req.body.difficulty,
    })
      .then((champion) => {
        res.status(201).json({
          status: "Champion Created",
          data: champion,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  update(req, res) {
    const champion = req.champion;

    champion.update(req.body)
      .then(() => {
        res.status(200).json({
          status: "Champion Updated",
          data: champion,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  show(req, res) {
    const champion = req.champion;

    res.status(200).json({
      status: "OK",
      data: champion,
    });
  },

  destroy(req, res) {
    req.champion.destroy()
      .then(() => {
        res.status(200).json({
          status: "Champion Deleted",
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  setChampion(req, res, next) {
    champion.findByPk(req.params.id)
      .then((champion) => {
        if (!champion) {
          res.status(404).json({
            status: "FAIL",
            message: "Data not found!",
          });

          return;
        }

        req.champion = champion;
        next()
      })
      .catch((err) => {
        res.status(404).json({
          status: "FAIL",
          message: "Post not found!",
        });
      });
  },
};
