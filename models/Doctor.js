const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const doctorSchema = new mongoose.Schema({
  firstName: String,
  midName: String,
  lastName: String,
  avatar: String,
  password: String,
  email: String,
  paitents: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Paitent",
    },
  ],
  role: {
    type: String,
    default: "Doctor",
  },
  visits: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Visit",
    },
  ],
  questions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  ],
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
  password: Joi.string().min(4).max(100).required(),
})

const Doctor = mongoose.model("Doctor", doctorSchema)

module.exports.Doctor = Doctor
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
