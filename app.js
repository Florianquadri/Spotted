import express from "express";
import createError from "http-errors";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import placesRouter from "./routes/places.js";
import notesRouter from "./routes/notes.js";
import picturesRouter from "./routes/pictures.js";
import authRouter from "./routes/auth.js";

import mongoose from 'mongoose';
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/express-api');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/places", placesRouter);
app.use("/notes", notesRouter);
app.use("/login", authRouter);
app.use("/pictures", picturesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;

