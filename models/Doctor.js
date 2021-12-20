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
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(100).required(),
})
const paitentsAddJoi = Joi.object({
  paitents: Joi.array().items(Joi.Objectid()),
})

const Doctor = mongoose.model("Doctor", doctorSchema)

module.exports.Doctor = Doctor
module.exports.loginJoi = loginJoi
