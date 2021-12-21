const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const CdSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  cumulativeDiabete: Number,
})

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
  Question: String,
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },

  diabetesType: {
    type: String,
    enum: ["Type A", "Type B", "gestational"],
  },
  cumulativeDiabetes: [CdSchema],
  CdAverage: {
    type: Number,
    default: 0,
  },
  bloodType: String,
  weight: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
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
  doctorId: Joi.Objectid().required(),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(100).required(),
})

const infoPaitentJoi = {
  bloodType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().min(2).max(100).required(),
  height: Joi.number().min(2).max(100).required(),
  diabetesType: Joi.string().valid("Type A", "Type B", "gestational").required(),
}

const addCdJoy = {
  cumulativeDiabetes: Joi.array().items(Joi.Objectid()),
}

const Paitent = mongoose.model("Paitent", paitentSchema)

module.exports.Paitent = Paitent
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
module.exports.infoPaitentJoi = infoPaitentJoi
module.exports.addCdJoy = addCdJoy
