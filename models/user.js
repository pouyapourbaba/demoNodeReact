const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 3, maxlength: 64 },
  last_name: { type: String, required: true, minlength: 3, maxlength: 64 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 255
  },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, first_name: this.first_name },
    "jwtPrivateKey"
  );
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    first_name: Joi.string()
      .min(3)
      .max(64)
      .required(),
    last_name: Joi.string()
      .min(3)
      .max(64)
      .required(),
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

function validatePassword(password) {
  const complexityOptions = {
    min: 6,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1
  };

  return Joi.validate(
    password,
    new PasswordComplexity(complexityOptions),
    (err, value) => {
      if (err) return err;
    }
  );
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validatePassword = validatePassword;
