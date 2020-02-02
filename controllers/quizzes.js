const Question = require("../models/question");
const Quizset = require("../models/quizset");

module.exports = {

  // list all quizes

  listQuizzes: (req, res, next) => {
    Question.find({})
      .populate("author", "-password")
      .exec((err, questions) => {
        if (err) return next(err);
        if (!questions)
          return res.json({ success: false, message: "No quizzes found!" });
        res.json({ questions, success: true });
      });
  },

  // only admins can access

  create: (req, res, next) => {
    req.body.userid = req.user.userid;
    Question.create(req.body, (err, questionToCreate) => {
      if (err) return next(err);
      if (!questionToCreate)
        return res.json({
          success: false,
          message: "can't create question!"
        });
      Question.findByIdAndUpdate(
        questionToCreate._id,
        { author: req.body.userid },
        (err, updated) => {
          if (err) return next(err);
        }
      );
      questionToCreate.quizset.forEach(topic => {
        Quizset.findOne({ topic }, (err, topicToFind) => {
          if (err) return next(err);
          if (!topicToFind) {
            Quizset.create(
              { $push: { questions: questionToCreate._id }, topic },
              (err, createdTopic) => {
                if (err) return next(err);
              }
            );
          } else if (topicToFind) {
            Quizset.findByIdAndUpdate(
              topicToFind._id,
              { $push: { questions: questionToCreate._id } },
              { new: true },
              (err, createdTopic) => {
                if (err) return next(err);
              }
            );
          }
        });
      });
      if (err) res.json({ message: "Can't create Question" });
      res.status(200).json({ success: true, questionToCreate });
    });
  },

  // get a quiz

  quiz: async (req, res, next) => {
    const id = req.params.id;
    try {
      let question = await Question.findById(id);
      if (!question)
        return res.json({ success: false, message: "question not found!" });
      res.json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  },

  //update quiz

  update: async (req, res, next) => {
    const id = req.params.id;
    try {
      let question = await Question.findByIdAndUpdate(id, req.body);
      if (!question)
        return res.json({ success: false, message: "question not found!" });
      res.json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  },

  //delete a quiz

  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      let questionToDelete = await Question.findByIdAndDelete(id);
      if (!questionToDelete)
        return res.json({ success: false, message: "quiz not found!" });
      let quizsetToUpdate = await Quizset.findOneAndUpdate(
        { topic: questionToDelete.quizset },
        { $pull: { questions: questionToDelete._id } }
      );
      if (!quizsetToUpdate)
        return res.json({
          success: false,
          message: "can't update Quizset"
        });
      res.json({
        success: true,
        message: "succesfully  deleted quiz",
        questionToDelete
      });
    } catch (err) {
      return next(err);
    }
  }
};
