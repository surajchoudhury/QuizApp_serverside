const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/api/users");
const userRouter = require("./routes/api/user");
const adminsRouter = require("./routes/api/admins");
const quizzesRouter = require("./routes/api/quizzes");
const quizSetsRouter = require("./routes/api/quizsets");

// initializing express in app

const app = express();

// middlewares

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//connecting to mongodb

mongoose.connect(
  "mongodb://localhost/Quizapp",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    console.log("connected ", err ? err : true);
  }
);

// routes

app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admins", adminsRouter);
app.use("/api/v1/quizzes", quizzesRouter);
app.use("/api/v1/quizsets", quizSetsRouter);

// error handlers

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, err });
});

module.exports = app;
