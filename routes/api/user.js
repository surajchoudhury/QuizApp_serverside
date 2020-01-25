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

router.put("/", (req, res, next) => {
  const id = req.user.userid;
  User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.json({ success: false, message: "user not found!" });
    User.findOneAndUpdate(
      user.score,
      { $push: { scoreList: user.score } },
      { new: true },
      (err, updatedUser) => {
        if (err) return next(err);
        if(!updatedUser) res.json({success:false,mesage:"no scores to update!"})
        res.json({ user, success: true });
      }
    );
  });
});

module.exports = router;
