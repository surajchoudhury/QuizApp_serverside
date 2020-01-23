const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  options: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Admin"
  },
  quizset: {
    type: String,
    required: true
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
