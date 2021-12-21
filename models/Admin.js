const mongoose = require("mongoose")
const Joi = require("joi")

const adminSchema = new mongoose.Schema({
  firstName: String,
  midName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String,
  role: {
    type: String,
    enum: ["Admin"],
  },
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(100).required(),
  avatar: Joi.string().uri().min(2).max(1000).required(),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(100).required(),
})

const Admin = mongoose.model("Admin", adminSchema)

module.exports.Admin = Admin
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
