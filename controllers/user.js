const Admin = require("../models/admin");
const User = require("../models/user");
const Score = require("../models/score");

module.exports = {
  // get logged user

  loggedUser: async (req, res, next) => {
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
  },

  // update: async (req, res, next) => {
  //   const id = req.user.userid;
  //   try {
  //     const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  //     if (!user)
  //       return res.json({ success: false, message: "user not found!" });
  //     let userToUpdate = await User.findOneAndUpdate(
  //       user.score,
  //       { $push: { scoreList: user.score } },
  //       { new: true }
  //     );
  //     if (!userToUpdate)
  //       return res.json({ success: false, mesage: "no scores to update!" });
  //     res.json({ user, success: true });
  //   } catch (err) {
  //     return next(err);
  //   }
  // },

  updateScore: async (req, res, next) => {
    let { userid } = req.user;
    req.body.userId = userid;
    try {
      let score = await Score.create(req.body);
      let scoreToUpdate = await Score.findOneAndUpdate(
        { _id: score._id },
        {
          user: req.body.userId
        }
      );
      return res.json({ scoreToUpdate, success: true });
    } catch (err) {
      return next(err);
    }
  },

  getScores: async (req, res, next) => {
    try {
      let scores = await Score.find({})
        .populate("user")
        .sort({ score: -1 });
      if (!scores)
        return res.json({ success: false, message: "No scores found!" });
      res.json({ success: true, scores });
    } catch (err) {
      return next(err);
    }
  },

  getscore: async (req, res, next) => {
    let { userid } = req.user;
    try {
      let score = await Score.find({ user: userid });
      if (!score)
        return res.json({ success: false, message: "No records found!" });
      res.json({ success: true, score });
    } catch (err) {
      return next(err);
    }
  }
};
