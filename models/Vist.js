const mongoose = require("mongoose")
const Joi = require("joi")
const joiObjectid = require("joi-objectid")

const visitSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  dates: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Paitent",
    },
  ],
})

const visitJoi = Joi.object({
  dates: Joi.array().items(Joi.Objectid().default(Date.now)),
})

const Visit = mongoose.model("Visit", visitSchema)

module.exports.Visit = Visit
module.exports.visitJoi = visitJoi
