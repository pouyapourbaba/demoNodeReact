// const config = require("config");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  // User validation
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send("error.details[0].message");

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
 
  // const jwtPrivateKey = config.get("jwtPrivateKey") || "jwtPrivateKey";
  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .min(6)
      .max(255)
      .email()
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;
