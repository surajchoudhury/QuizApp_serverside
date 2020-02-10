const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizsetSchema = new Schema(
  {
    questions: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Question"
      }
    ],
    topic: {
      type: String,
      unique: true
    },
    completedByUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Quizset = mongoose.model("Quizset", quizsetSchema);

module.exports = Quizset;
