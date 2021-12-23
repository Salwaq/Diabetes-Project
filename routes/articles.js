const express = require("express")
const router = express.Router()
const { Article, articleJoi } = require("../models/Article")
const validateBody = require("../midllewere/validateBody")
const checkAdmin = require("../midllewere/checkAdmin")
const checkId = require("../midllewere/checkId")

router.get("/", async (req, res) => {
  const articles = await Article.find()
  res.json(articles)
})

router.post("/", checkAdmin, validateBody(articleJoi), async (req, res) => {
  try {
    const { title, description, image, auther } = req.body
    const id = req.userId
    const article = new Article({
      title,
      description,
      image,
      auther: id,
    })

    await article.save()
    res.send(article)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.put("/:articleId", checkId("articleId"), checkAdmin, async (req, res) => {
  const { title, description, image, auther } = req.body

  try {
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      {
        $set: { title, description, image, auther: req.userId },
      },
      { new: true }
    )
    if (!article) return res.status(404).json("article not found")

    res.json(article)
  } catch (error) {
    return res.status(500).json(error.massege)
  }
})

router.delete("/:articleId", checkId("articleId"), checkAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndRemove(req.params.articleId)
    if (!article) return res.status(404).json("article not found")

    res.json("article removed")
  } catch (error) {
    return res.status(500).json(error.massege)
  }
})

module.exports = router
