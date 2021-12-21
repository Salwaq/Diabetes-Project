const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const visitSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  dates: Date,
})

const visitJoi = Joi.object({
  date: Joi.date().raw().required(),
})

const Visit = mongoose.model("Visit", visitSchema)

module.exports.Visit = Visit
module.exports.visitJoi = visitJoi
