
const Quizset = require("../models/quizset");

module.exports = {

  //get quizsets

  listQuizsets: async (req, res, next) => {
    try {
      let quizsets = await Quizset.find({});
      if (!quizsets)
        return res.json({ success: false, message: "No Quizsets found!" });
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
        path: "questions"
      });
      if (!quizset)
        return res.json({ success: false, message: "No Quizset found!" });
      res.json({ success: true, quizset });
    } catch (err) {
      return next(err);
    }
  },

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
  }
};
