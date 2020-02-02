const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  create: async (req, res, next) => {
    try {
      let user = await User.create(req.body);
      if (!user)
        return res.json({ success: false, message: "user not found!" });
      res.json({ user, success: true });
    } catch (err) {
      return next(err);
    }
  },

  // login user

  login: async (req, res, next) => {
    let { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
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
  },

  /* GET users listing. */

  listUsers: async (req, res, next) => {
    try {
      let users = await User.find({}, "-password");
      if (!users)
        return res.json({ success: false, message: "no users found!" });
      res.json({ success: true, users });
    } catch (err) {
      return next(err);
    }
  },

  //get a user

  getUser: async (req, res, next) => {
    const id = req.params.id;
    try {
      let user = await User.findById(id, "-password");
      if (!user) res.json({ success: false, message: "no user found!" });
      res.json({ user, success: true });
    } catch (err) {
      return next(err);
    }
  },

  // update user

  update: async (req, res, next) => {
    const id = req.params.id;
    try {
      let user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user)
        return res.json({ success: false, message: "user not found!" });
      res.json({ user, success: true });
    } catch (err) {
      return next(err);
    }
  },

  // update some info of user

  updatePortion: async (req, res, next) => {
    const id = req.params.id;
    try {
      let user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user)
        return res.json({ success: false, message: "user not found!" });
      res.json({ user, success: true });
    } catch (err) {
      return next(err);
    }
  },

  // delete a user

  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      let user = await User.findByIdAndDelete(id);
      if (!user)
        return res.json({ success: false, message: "user not found!" });
      res.json({ user, success: true, message: "succesfully deleted!" });
    } catch (err) {
      return next(err);
    }
  }
};
