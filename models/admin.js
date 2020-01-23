const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: /@/,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: true
  }
});

adminSchema.pre("save", function(next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, password) => {
      if (err) return next(err);
      this.password = password;
      next();
    });
  } else {
    next();
  }
});

adminSchema.methods.verifyPassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, matched) => {
    if (err) return done(null, false);
    done(null, matched);
  });
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
