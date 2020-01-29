const express = require("express");
const Quizset = require("../../models/quizset");
const router = express.Router();
const auth = require("../../modules/auth");

//get quizsets

router.get("/", async (req, res, next) => {
  try {
    let quizsets = await Quizset.find({}).populate("quiz");
    if (!quizsets)
      return res.json({ success: false, message: "No Quizsets found!" });
    res.json({ success: true, quizsets });
  } catch (err) {
    return next(err);
  }
});

router.use(auth.verifyToken, auth.verifyAdmin);

// update a quizset

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let quizset = await Quizset.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!quizset)
      return res.json({ success: false, message: "quizset not found!" });
    res.json({ success: true, quizset });
  } catch (err) {
    return next(err);
  }
});

// router.put("/:id", (req, res, next) => {
//   const id = req.params.id;
//   Quizset.findById({ id }, (err, oldquizset) => {
//     if (err) return next(err);
//     if (!oldquizset)
//       return res.json({ success: false, message: "quizset not found!" });
//     Quizset.findByIdAndUpdate(id, (err, updatedQuizset) => {
//       if (err) return next(err);
//       if (!updatedQuizset)
//         return res.json({ success: false, message: "can't update quizset!" });
//       Quiz.findOneAndUpdate(
//         { quizset: oldquizset.topic },
//         { quizset: updatedQuizset.topic },
//         { new: true },
//         (err, updatedQuiz) => {
//           if (err) return next(err);
//           if (!updatedQuiz)
//             return res.json({ success: false, message: "quiz not found!" });
//         }
//       );
//     });
//   });
// });

// delete a quizset

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    let quizset = await Quizset.findByIdAndDelete(id);
    if (!quizset)
      return res.json({ success: false, message: "No quizset found!" });
    res.json({
      success: true,
      message: "quizset deleted succesfully!"
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
