const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  paitent: {
    type: mongoose.Types.ObjectId,
    ref: "Paitent",
  },
})

const questionJoi = Joi.object({
  question: Joi.string().min(2).max(100000).required(),
})
const answerJoi = Joi.object({
  answer: Joi.string().min(2).max(100000).required(),
})
const Question = mongoose.model("Question", questionSchema)

module.exports.Question = Question
module.exports.answerJoi = answerJoi
module.exports.questionJoi = questionJoi
