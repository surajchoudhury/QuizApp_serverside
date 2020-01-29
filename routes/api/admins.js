const express = require("express");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();

// register Admin

router.post("/", async (req, res, next) => {
  try {
    let admin = await Admin.create(req.body);
    if (!admin)
      return res.json({ message: "can't create Admin", success: false });
    res.json({ admin, success: true });
  } catch (err) {
    return next(err);
  }
});

// login Admin

router.post("/login", async (req, res, next) => {
  let { email, password } = req.body;
  try {
    let user = await Admin.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid Email!" });
    user.verifyPassword(password, (err, matched) => {
      if (err) return next(err);
      if (!matched)
        return res.json({ success: false, message: "Invalid Password!" });

      // jwt

      jwt.sign(
        {
          userid: user._id,
          username: user.username,
          email: user.email,
          isadmin: user.isAdmin
        },
        "secret",
        (err, token) => {
          if (err) return next(err);
          res.json({ success: true, message: "you are logged in", token });
        }
      );
    });
  } catch (err) {
    return next(err);
  }
});

// get all admins listing

router.get("/", async (req, res, next) => {
  try {
    let admins = await Admin.find({}, "-password");
    if (!admins)
      return res.json({ success: false, message: "admins not found!" });
    res.json({ admins, success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
