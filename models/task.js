const moment = require("moment");
const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  task_title: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }
});

function getStartAndEndOfTheWeek() {
  const today = new Date();
  let start_date = today.getDate() - today.getDay();
  start_date = new Date(today.setDate(start_date));
  start_date.setHours(24, 0, 0, 0);
  start_date = moment(start_date).local();

  let end_date = today.getDate() - today.getDay() + 7;
  end_date = new Date(today.setDate(end_date));
  end_date.setHours(23, 59, 59, 0);
  end_date = moment(end_date).local();

  return ({
    startOfWeek: start_date,
    endOfWeek: end_date
  });
};

const Task = mongoose.model("Task", taskSchema);

function validateTask(task) {
  const schema = {
    task_title: Joi.string()
      .min(3)
      .max(64)
      .required()
      .trim(),
    user_id: Joi.objectId().required(),
    start_date: Joi.date(),
    end_date: Joi.date()
  };

  return Joi.validate(task, schema);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
module.exports.getStartAndEndOfTheWeek = getStartAndEndOfTheWeek;

