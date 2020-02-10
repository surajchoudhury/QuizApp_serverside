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

//add user in quizset

router.post("/:topic/add", Quizset.completedQuizset);

// router.post("/:topic/delete", Quizset.deleteUser);

//create quizset

router.post("/", auth.verifyAdmin, Quizset.create);

//create questions

router.post("/:topic", auth.verifyAdmin, Quizset.question);

// update a quizset

router.put("/:id", auth.verifyAdmin, Quizset.update);

// delete a quizset

router.delete("/:id", auth.verifyAdmin, Quizset.delete);

//delete question

router.delete("/:topic/question/:id", auth.verifyAdmin, Quizset.deleteQuestion);

module.exports = router;
