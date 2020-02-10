const Quizset = require("../models/quizset");
// const User = require("../models/user");
const Question = require("../models/question");

module.exports = {
  //get quizsets

  listQuizsets: async (req, res, next) => {
    try {
      let quizsets = await Quizset.find({}).populate("questions");
      res.json({ success: true, quizsets });
    } catch (err) {
      return next(err);
    }
  },

  //get a quizset

  quizset: async (req, res, next) => {
    const topic = req.params.topic;
    try {
      let quizset = await Quizset.findOne({ topic }).populate({
        path: "questions",
        populate: {
          path: "author"
        }
      });
      if (!quizset)
        return res.json({ success: false, message: "No Quizset found!" });
      res.json({ success: true, quizset });
    } catch (err) {
      return next(err);
    }
  },

  //create a quizset

  create: async (req, res, next) => {
    try {
      let quizset = await Quizset.create(req.body);
      res.json({ success: true, quizset });
    } catch (err) {
      return next(err);
    }
  },

  //create a question

  question: async (req, res, next) => {
    const topic = req.params.topic;
    const userId = req.user.userid;
    try {
      let question = await Question.create(req.body);
      let quizset = await Quizset.findOneAndUpdate(
        { topic },
        {
          $push: { questions: question._id }
        },
        { new: true }
      );
      if (!quizset)
        return res.json({ success: false, message: "Quizset not found!" });
      let questionToUpdate = await Question.findByIdAndUpdate(question._id, {
        author: userId,
        quizset: quizset.topic
      });
      res.json({ success: true, quizset, question });
    } catch (err) {
      return next(err);
    }
  },

  // question: (req, res, next) => {
  //   const topic = req.params.topic;
  //   req.body.userId = req.user.userid;

  //   Question.create(req.body, (err, question) => {
  //     if (err) return next(err);
  //     Quizset.findOneAndUpdate(
  //       { topic },
  //       {
  //         $push: { questions: question._id }
  //       },
  //       { new: true },
  //       (err, quizset) => {
  //         if (err) return next(err);
  //         if (!quizset)
  //           return res.json({ success: false, message: "No quizset found!" });
  //       }
  //     );
  //     Question.findByIdAndUpdate(
  //       question._id,
  //       {
  //         author: req.body.userId,
  //         quizset: topic
  //       },
  //       { new: true },
  //       (err, updatedQuestion) => {
  //         if (err) return next(err);
  //         if (!updatedQuestion)
  //           return res.json({ success: false, message: "Question not found!" });
  //       }
  //     );
  //     res.json({ success: true, question });
  //   });
  // },

  // update a quizset

  update: async (req, res, next) => {
    const id = req.params.id;
    try {
      let quizset = await Quizset.findByIdAndUpdate(id, req.body, {
        new: true
      });
      if (!quizset)
        return res.json({ success: false, message: "quizset not found!" });
      res.json({ success: true, quizset });
      if (quizset.questions.length) {
        quizset.questions.forEach(question => {
          Question.findByIdAndUpdate(
            question._id,
            {
              quizset: quizset.topic
            },
            { new: true },
            (err, question) => {
              if (err) return next(err);
            }
          );
        });
      }
      res.json({ success: true, quizset });
    } catch (err) {
      return next(err);
    }
  },

  // delete a quizset

  delete: async (req, res, next) => {
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
  },

  //delete question

  deleteQuestion: async (req, res, next) => {
    const id = req.params.id;
    const topic = req.params.topic;
    try {
      let quizset = await Quizset.findOne({ topic });
      if (quizset.questions.includes(id)) {
        let quizsetToUpdate = await Quizset.findByIdAndUpdate(
          quizset._id,
          {
            $pull: { questions: id }
          },
          { new: true }
        );
        let questionToUpdate = await Question.findByIdAndDelete(id);
        if (!questionToUpdate)
          return res.json({ success: false, message: "can't find question" });
        res.json({ success: true, quizsetToUpdate });
      }
    } catch (err) {
      return next(err);
    }
  },

  completedQuizset: async (req, res, next) => {
    const userid = req.user.userid;
    const topic = req.params.topic;
    try {
      let quizset = await Quizset.findOne({ topic });
      if (!quizset)
        return res.json({
          success: false,
          message: "No Quizset found by topic!"
        });
      if (!quizset.completedByUsers.includes(userid)) {
        let quizsetToUpdate = await Quizset.findOneAndUpdate(
          { topic },
          {
            $push: { completedByUsers: userid }
          },
          { new: true }
        );
        res.json({ success: true, quizsetToUpdate });
      } else {
        res.json({
          success: false,
          message: "Already added in completed List!"
        });
      }
    } catch (err) {
      return next(err);
    }
  }
  // deleteUser: (req, res, next) => {
  //   let topic = req.params.topic;
  //   let userid = req.user.userid;
  //   Quizset.findOneAndUpdate(
  //     { topic },
  //     {
  //       $pull: { completedByUsers: userid }
  //     },
  //     { new: true },
  //     (err, quiz) => {
  //       if (err) return next(err);
  //       res.json(quiz);
  //     }
  //   );
  // }
};
