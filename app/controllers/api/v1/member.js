/**
 * @file contains request handler of post resource
 */
const { member } = require("../../../models");

module.exports = {
  list(req, res) {
    member.findAll()
      .then((members) => {
        res.status(200).json({
          status: "OK",
          data: {
            members,
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
    member.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        user_id: req.body.user_id,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
    })
      .then((member) => {
        res.status(201).json({
          status: "Created",
          data: member,
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
    const member = req.member;

    member.update(req.body)
      .then(() => {
        res.status(200).json({
          status: "Updated",
          data: member,
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
    const member = req.member;

    res.status(200).json({
      status: "OK",
      data: member,
    });
  },

  destroy(req, res) {
    req.member.destroy()
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  setmember(req, res, next) {
    member.findByPk(req.params.id)
      .then((member) => {
        if (!member) {
          res.status(404).json({
            status: "FAIL",
            message: "Data not found!",
          });

          return;
        }

        req.member = member;
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
