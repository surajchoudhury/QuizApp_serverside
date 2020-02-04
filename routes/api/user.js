const express = require("express");
const router = express.Router();
const auth = require("../../modules/auth");
const User = require("../../controllers/user");

router.use(auth.verifyToken);

// get current logged user

router.get("/", User.loggedUser);

//update user

router.put("/", User.updateScore);

//scores

router.get("/scores", User.getScores);

//score

router.get("/score", User.getscore);

module.exports = router;
