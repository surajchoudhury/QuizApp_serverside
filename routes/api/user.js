const express = require("express");
const router = express.Router();
const auth = require("../../modules/auth");
const Admin = require("../../models/admin");
const User = require("../../models/user");

router.use(auth.verifyToken);

// get current logged user

router.get("/", async (req, res, next) => {
  const { username } = req.user;
  try {
    const user = await User.findOne({ username }, "-password");
    if (!user) {
      const user = await Admin.findOne({ username }, "-password");
      res.json({ success: true, user });
    } else {
      res.json({ success: true, user });
    }
  } catch (err) {
    return next(err);
  }
});

router.put("/", async (req, res, next) => {
  const id = req.user.userid;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.json({ success: false, message: "user not found!" });
    let userToUpdate = await User.findOneAndUpdate(
      user.score,
      { $push: { scoreList: user.score } },
      { new: true }
    );
    if (!userToUpdate)
      return res.json({ success: false, mesage: "no scores to update!" });
    res.json({ user, success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
