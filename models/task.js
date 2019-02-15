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

const Task = mongoose.model("Task", taskSchema);

function validateTask(task) {
    const schema = {
        // task_title = Joi.string().min(3).max(64).required(),
        // user_id: Joi.objectId().required()
    }
}

module.exports.Task = Task;
// module.exports.validateTask = validateTask;
