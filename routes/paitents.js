const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Paitent, loginJoi, signupJoi, profileJoi } = require("../models/Paitent")
require("dotenv").config()
const validateBody = require("../midllewere/validateBody")

router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, midName, lastName, email, avatar, password, gendar, insurance, phoneNumber, smoking } = req.body

    const userFound = await Paitent.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new Paitent({
      firstName,
      midName,
      lastName,
      email,
      avatar,
      password: hash,
      gendar,
      insurance,
      phoneNumber,
      smoking,
    })

    await user.save()
    res.send("new user of Paitent created")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const userPaitent = await Paitent.findOne({ email })

    if (!userPaitent) return res.status(404).send("user not found")
    const valid = await bcrypt.compare(password, userPaitent.password)
    if (!valid) return res.status(400).send("password not correct")

    const token = jwt.sign({ id: userPaitent._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/profile", validateBody(profileJoi), async (req, res) => {
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
