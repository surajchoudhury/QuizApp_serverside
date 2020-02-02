const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    score: {
      type: Number,
      required: true
    },
    quizset: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

let Score = mongoose.model("Score",scoreSchema);
module.exports = Score;


