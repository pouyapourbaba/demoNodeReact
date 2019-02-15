// const config = require("config")
const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const moment = require("moment");
const mongoose = require("mongoose");
const { Task, validateTask } = require("./models/task");
const { User, validateUser } = require("./models/user");
const users = require("./routes/users");
const auth = require("./routes/auth");
const loginRequired = require("./routes/loginRequired");

const app = express();

mongoose
  .connect("mongodb://localhost/scheduleApp", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err.message));

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/loginrequired", loginRequired);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
