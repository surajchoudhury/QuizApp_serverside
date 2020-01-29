const express = require("express");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../../modules/auth");
const router = express.Router();

// register user

router.post("/", async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    if (!user) return res.json({ success: false, message: "user not found!" });
    res.json({ user, success: true });
  } catch (err) {
    return next(err);
  }
});

// login user

router.post("/login", async (req, res, next) => {
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
});

/* GET users listing. */

router.get("/", async (req, res, next) => {
  try {
    let users = await User.find({}, "-password");
    if (!users) return res.json({ success: false, message: "no users found!" });
    res.json({ success: true, users });
  } catch (err) {
    return next(err);
  }
});

//get a user

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let user = await User.findById(id, "-password");
    if (!user) res.json({ success: false, message: "no user found!" });
    res.json({ user, success: true });
  } catch (err) {
    return next(err);
  }
});

router.use(auth.verifyToken);

// update user

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.json({ success: false, message: "user not found!" });
    res.json({ user, success: true });
  } catch (err) {
    return next(err);
  }
});

// update some info of user

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.json({ success: false, message: "user not found!" });
    res.json({ user, success: true });
  } catch (err) {
    return next(err);
  }
});

// delete a user

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let user = await User.findByIdAndDelete(id);
    if (!user) return res.json({ success: false, message: "user not found!" });
    res.json({ user, success: true, message: "succesfully deleted!" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
