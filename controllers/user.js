
const Admin = require("../models/admin");
const User = require("../models/user");

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

  update: async (req, res, next) => {
    const id = req.user.userid;
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user)
        return res.json({ success: false, message: "user not found!" });
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
  }
};
