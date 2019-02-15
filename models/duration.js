const mongoose = require("mongoose");
const Joi = require("joi");

const durationsSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  day_of_week: { type: Number, required: true },
  duration_of_task: { type: Number, required: true }
});

const Duration = mongoose.model("Duration", durationsSchema);

module.exports.Duration = Duration;
