const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    score: {
      type: String,
      required: true
    },
    quizset: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

let Score = mongoose.model("Score",scoreSchema);
module.exports = Score;

// submitMarks: (req, res) => {
//   let { userId } = req.user;
//   req.body.userId = userId;
//   Mark.create(req.body, (err, createdMark) => {
//     if (err) return res.json({ err });
//     User.findOneAndUpdate(
//       { _id: createdMark.userId },
//       { $push: { marksId: createdMark.id } },
//       { new: true },
//       (err, updatedUser) => {
//         if (err) return res.json({ err });
//         return res.json({ createdMark, success: true });
//       }
//     );
//   });
// }
// };
