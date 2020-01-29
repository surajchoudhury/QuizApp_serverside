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

router.use(auth.verifyToken, auth.verifyAdmin);

// only admins can access

router.post("/", async (req, res, next) => {
  const adminid = req.user.userid;
  try {
    let quizToCreate = await Quiz.create(req.body);
    if (!quizToCreate)
      return res.json({ success: false, message: "can't create Quiz" });
    let quizToUpdate = await Quiz.findByIdAndUpdate(quizToCreate._id, {
      author: adminid
    });
    if (!quizToUpdate)
      return res.json({ success: false, message: "quiz not found!" });
    let quizsetToFind = await Quizset.findOne({ topic: quizToCreate.quizset });
    if (!quizsetToFind) {
      let quizsetToCreate = await Quizset.create(
        {
          $push: { quiz: quizToCreate._id },
          topic: quizToCreate.quizset
        },
        { new: true }
      );
    } else if (quizsetToFind) {
      let quizsetToUpdate = await Quizset.findByIdAndUpdate(
        quizsetToFind._id,
        { $push: { quiz: quizToCreate._id } },
        { new: true }
      );
    }
    res.status(200).json({
      success: true,
      message: "Quiz created Succesfully!",
      quizToCreate
    });
  } catch (err) {
    return next(err);
  }
});

// router.post("/", (req, res, next) => {
//   const adminid = req.user.userid;
//   Quiz.create(req.body, (err, quizToCreate) => {
//     if (err) return next(err);
//     if (!quizToCreate)
//       return res.json({ success: false, message: "No Quiz found!" });
//     Quiz.findByIdAndUpdate(
//       quizToCreate._id,
//       { author: adminid },
//       (err, updatedQuiz) => {
//         if (err) return next(err);
//         if (!updatedQuiz)
//           return res.json({ success: false, message: "admin not found!" });
//       }
//     );
//     Quizset.findOne({ topic: quizToCreate.quizset }, (err, quizset) => {
//       if (err) return next(err);
//       if (!quizset) {
//         Quizset.create(
//           {
//             $push: { quiz: quizToCreate._id },
//             topic: quizToCreate.quizset
//           },
//           { new: true },
//           (err, createdQuizset) => {
//             if (err) return next(err);
//           }
//         );
//       } else if (quizset) {
//         Quizset.findByIdAndUpdate(
//           quizset._id,
//           { $push: { quiz: quizToCreate._id } },
//           { new: true },
//           (err, createdQuizset) => {
//             if (err) return next(err);
//           }
//         );
//       }
//     });
//     res.status(200).json({
//       success: true,
//       message: "Quiz created Succesfully!",
//       quizToCreate
//     });
//   });
// });

// get a quiz

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let quiz = await Quiz.findById(id);
    if (!quiz) return res.json({ success: false, message: "quiz not found!" });
    res.json({ success: true, quiz });
  } catch (err) {
    return next(err);
  }
});

//update quiz

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let quiz = await Quiz.findByIdAndUpdate(id, req.body);
    if (!quiz) return res.json({ success: false, message: "quiz not found!" });
    res.json({ success: true, quiz });
  } catch (err) {
    return next(err);
  }
});

//delete a quiz

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let quizToDelete = await Quiz.findByIdAndDelete(id);
    if (!quizToDelete)
      return res.json({ success: false, message: "quiz not found!" });
    let quizsetToUpdate = await Quizset.findOneAndUpdate(
      { topic: quizToDelete.quizset },
      { $pull: { quiz: quizToDelete._id } }
    );
    if (!quizsetToUpdate)
      return res.json({
        success: false,
        message: "can't update Quizset"
      });
    res.json({
      success: true,
      message: "succesfully  deleted quiz",
      quizToDelete
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
