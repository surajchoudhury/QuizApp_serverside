const express = require("express");
const router = express.Router();
const auth = require("../../modules/auth");
const Admin = require("../../models/admin");
const User = require("../../models/user");

router.use(auth.verifyToken);

// get current logged user

router.get("/", (req, res, next) => {
  let { username } = req.user;
  User.findOne({ username }, "-password").exec((err, user) => {
    if (err) return next(err);
    if (!user) {
      Admin.findOne({ username }, "-password").exec((err, user) => {
        if (err) return next(err);
        res.json({ success: true, user });
      });
    } else {
      res.json({ success: true, user });
    }
  });
});

module.exports = router;
