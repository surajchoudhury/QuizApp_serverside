const express = require("express");
const Quiz = require("../../models/quiz");
const router = express.Router();
const Quizset = require("../../models/quizset");
const auth = require("../../modules/auth");

// list all quizes

router.get("/", (req, res, next) => {
  Quiz.find({})
    .populate("author", "-password")
    .exec((err, quizzes) => {
      if (err) return next(err);
      if (!quizzes)
        return res.json({ success: false, message: "No quizzes found!" });
      res.json({ quizzes, success: true });
    });
});

router.use(auth.verifyToken);
router.use(auth.verifyAdmin);

// only admins can access

router.post("/", (req, res, next) => {
  const adminid = req.user.userid;
  Quiz.create(req.body, (err, quizToCreate) => {
    if (err) return next(err);
    if (!quizToCreate)
      return res.json({ success: false, message: "No Quiz found!" });
    Quiz.findByIdAndUpdate(
      quizToCreate._id,
      { author: adminid },
      (err, updatedQuiz) => {
        if (err) return next(err);
        if (!updatedQuiz)
          return res.json({ success: false, message: "admin not found!" });
      }
    );
    Quizset.findOne({ topic: quizToCreate.quizset }, (err, quizset) => {
      if (err) return next(err);
      if (!quizset) {
        Quizset.create(
          {
            $push: { quiz: quizToCreate._id },
            topic: quizToCreate.quizset
          },
          { new: true },
          (err, createdQuizset) => {
            if (err) return next(err);
          }
        );
      } else if (quizset) {
        Quizset.findByIdAndUpdate(
          quizset._id,
          { $push: { quiz: quizToCreate._id } },
          { new: true },
          (err, createdQuizset) => {
            if (err) return next(err);
          }
        );
      }
    });
    res.status(200).json({
      success: true,
      message: "Quiz created Succesfully!",
      quizToCreate
    });
  });
});

// get a quiz

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Quiz.findById(id, (err, quiz) => {
    if (err) return next(err);
    if (!quiz) return res.json({ success: false, message: "quiz not found!" });
    res.json({ success: true, quiz });
  });
});

//update quiz

router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  Quiz.findByIdAndUpdate(id, req.body, (err, quizToUpdate) => {
    if (err) return next(err);
    if (!quizToUpdate)
      return res.json({ success: false, message: "quiz not found!" });
    res.json({ success: true, quizToUpdate });
  });
});

//delete a quiz

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Quiz.findByIdAndDelete(id, (err, quizToDelete) => {
    if (err) return next(err);
    if (!quizToDelete)
      return res.json({ success: false, message: "quiz not found!" });
    Quizset.findOneAndUpdate(
      { topic: quizToDelete.quizset },
      { $pull: { quiz: quizToDelete._id } },
      (err, updatedQuizset) => {
        if (err) return next(err);
        if (!updatedQuizset)
          return res.json({
            success: false,
            message: "can't update Quizset"
          });
      }
    );
    res.json({
      success: true,
      message: "succesfully  deleted quiz",
      quizToDelete
    });
  });
});

module.exports = router;
