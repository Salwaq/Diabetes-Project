const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Doctor, loginJoi } = require("../models/Doctor")

require("dotenv").config()
const validateBody = require("../midllewere/validateBody")

router.get("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is required")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const user = await Doctor.findById(userId)
    if (!user) return res.status(400).json("user not found")
    req.userId = userId

    const userDoctor = await Doctor.findById(req.userId).select("-__v -password")
    res.json(userDoctor)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
