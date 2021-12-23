const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const paitentSchema = new mongoose.Schema({
  firstName: String,
  midName: String,
  lastName: String,
  avatar: String,
  email: String,
  password: String,
  gendar: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: String,
  insurance: String,
  MNR: String,
  questions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  ],
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  infoPaitent: {
    type: mongoose.Types.ObjectId,
    ref: "infoPaitent",
  },
  visits: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Visit",
    },
  ],

  smoking: {
    type: Boolean,
    default: false,
  },
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  midName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().uri().min(2).max(1000).required(),
  gendar: Joi.string().min(2).max(100).required(),
  insurance: Joi.string().min(2).max(100),
  smoking: Joi.boolean(),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  doctor: Joi.Objectid().required(),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(100).required(),
})

const Paitent = mongoose.model("Paitent", paitentSchema)

module.exports.Paitent = Paitent
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
