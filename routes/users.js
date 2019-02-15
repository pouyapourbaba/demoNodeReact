const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser, validatePassword } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // User object validation
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Password Complexity
  const passwordComplexity = validatePassword(req.body.password);
  if (passwordComplexity)
    return res.send(passwordComplexity.details[0].message);

  // User existence check
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("A user with this email already exists.");

  user = new User(
    _.pick(req.body, ["first_name", "last_name", "email", "password"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "first_name", "last_name", "email"]));
});

module.exports = router;
