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

const infoPaitentSchema = new mongoose.Schema({
  paitentId: {
    type: mongoose.Types.ObjectId,
    ref: "Paitent",
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
})

const infoPaitentJoi = Joi.object({
  bloodType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().min(2).max(100).required(),
  height: Joi.number().min(2).max(200).required(),
  diabetesType: Joi.string().valid("Type A", "Type B", "gestational").required(),
})

const addCdJoy = {
  cumulativeDiabetes: Joi.number().min(2).max(200).required(),
}

const infoPaitent = mongoose.model("infoPaitent", infoPaitentSchema)

module.exports.infoPaitent = infoPaitent
module.exports.infoPaitentJoi = infoPaitentJoi
module.exports.addCdJoy = addCdJoy
