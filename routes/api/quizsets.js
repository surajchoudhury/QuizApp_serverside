const express = require("express");
const Quizset = require("../../controllers/quizsets");
const router = express.Router();
const auth = require("../../modules/auth");

//get quizsets

router.get("/", Quizset.listQuizsets);

//get a quizset

router.get("/:topic", Quizset.quizset);

//check logged user

router.use(auth.verifyToken);

// update a quizset

router.put("/:id", auth.verifyAdmin, Quizset.update);

// delete a quizset

router.delete("/:id", auth.verifyAdmin, Quizset.delete);

module.exports = router;
