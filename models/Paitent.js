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
  Question: String,
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },

  diabetesType: {
    type: String,
    enum: ["Type A", "Type B", "gestational"],
    ref: "Doctor",
  },
  cumulativeDiabetes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  bloodType: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  weight: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  height: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  smoking: {
    type: String,
    default: false,
  },
})

const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  midName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(2).max(100).required(),
  avatar: Joi.string().uri().min(2).max(1000).required(),
  gendar: Joi.string().min(2).max(100).required(),
  insurance: Joi.string().min(2).max(100),
  smoking: Joi.boolean(),
  phoneNumber: Joi.number().min(1).max(10).required(),
})

const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(100).required(),
})

const profileJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  midName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  gendar: Joi.string().min(2).max(100),
  password: Joi.string().min(2).max(100),
  avatar: Joi.string().uri().min(2).max(100),
  insurance: Joi.string().min(2).max(100),
  phoneNumber: Joi.number().min(10).max(100),
  Question: Joi.string().min(2).max(10000),
})

const infoPaitentJoi = {
  MNR: Joi.number().min(2).max(100).required(),
  bloodType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().min(2).max(100).required(),
  height: Joi.number().min(2).max(100).required(),
  diabetesType: Joi.string().valid("Type A", "Type B", "gestational").required(),
  cumulativeDiabetes: Joi.array().items(Joi.Objectid()),
}

const addInfoPaitentJoi = {
  MNR: Joi.number().min(2).max(100).required(),
  bloodType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().min(2).max(100).required(),
  height: Joi.number().min(2).max(100).required(),
  diabetesType: Joi.string().valid("Type A", "Type B", "gestational").required(),
  cumulativeDiabetes: Joi.array().items(Joi.Objectid()),
}

const editInfoPaitentJoi = {
  MNR: Joi.number().min(2).max(100).required(),
  bloodType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().min(2).max(100).required(),
  height: Joi.number().min(2).max(100).required(),
  diabetesType: Joi.string().valid("Type A", "Type B", "gestational").required(),
  cumulativeDiabetes: Joi.array().items(Joi.Objectid()),
}
const Paitent = mongoose.model("Paitent", paitentSchema)

module.exports.Paitent = Paitent
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
module.exports.profileJoi = profileJoi
module.exports.infoPaitentJoi = infoPaitentJoi
module.exports.addInfoPaitentJoi = addInfoPaitentJoi
module.exports.editInfoPaitentJoi = editInfoPaitentJoi
