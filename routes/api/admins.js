const express = require("express");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();

// register Admin

router.post("/", (req, res, next) => {
  Admin.create(req.body, (err, Admin) => {
    if (err) return next(err);
    if (!Admin) return res.json({ message: "no Admin found!", success: false });
    res.json({ Admin, success: true });
  });
});

// login Admin

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  Admin.findOne({ email }, (err, admin) => {
    if (err) return next(err);
    if (!admin) return res.json({ success: false, message: "invalid Email!" });
    admin.verifyPassword(password, (err, matched) => {
      if (err) return next(err);
      if (!matched)
        return res
          .status(422)
          .json({ success: false, message: "invalid password" });

      // jwt authentication

      jwt.sign(
        {
          userid: admin._id,
          username: admin.username,
          email: admin.email,
          isadmin: admin.isAdmin
        },
        "secret",
        (err, token) => {
          if (err) return next(err);
          res.json({ success: true, message: "you are logged in", token });
        }
      );
    });
  });
});

// get all admins listing

router.get("/", (req, res, next) => {
  Admin.find({}, "-password", (err, admins) => {
    if (err) return next(err);
    if (!admins)
      return res.json({ success: false, message: "no admins found!" });
    res.json({ admins, success: true });
  });
});

module.exports = router;
