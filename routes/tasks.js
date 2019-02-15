const auth = require("../middlewares/auth");
const moment = require("moment");
const {
  Task,
  validateTask,
  getStartAndEndOfTheWeek
} = require("../models/task");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user_id: req.user._id });
  res.send(tasks);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const startAndEndOfWeek = getStartAndEndOfTheWeek();
  console.log(startAndEndOfWeek.startOfWeek);

  let task = new Task({
    task_title: req.body.task_title,
    user_id: req.body.user_id,
    start_date: startAndEndOfWeek.startOfWeek,
    end_date: startAndEndOfWeek.endOfWeek
  });

  task = await task.save();
  res.send(task);
});

router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task)
    return res.status(400).send("No task with this id exists in the database.");
  res.send(task);
});

router.put("/:id", auth, async (req, res) => {
  // validation

  const task = await Task.findByIdAndUpdate( req.params.id, { task_title: req.body.task_title }, { new: true } );
  if (!task)
    return res.status(400).send("No task with this id exists in the database.");

  res.send(task);
});

module.exports = router;
