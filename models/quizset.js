const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizsetSchema = new Schema({
  quiz: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Quiz"
  },
  topic: {
    type: String
  }
});

const Quizset = mongoose.model("Quizset", quizsetSchema);

module.exports = Quizset;
