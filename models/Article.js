const mongoose = require("mongoose")
const Joi = require("joi")

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  auther: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
})

const articleJoi = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().min(2).max(9999999999).required(),
})

const Article = mongoose.model("Artical", articleSchema)

module.exports.Article = Article
module.exports.articleJoi = articleJoi
