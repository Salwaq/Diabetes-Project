const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Admin, loginJoi, signupJoi, profileJoi } = require("../models/Admin")
require("dotenv").config()
const validateBody = require("../midllewere/validateBody")
const checkAdmin = require("../midllewere/checkAdmin")
const checkToken = require("../midllewere/checkToken")

router.post("/signup-admin", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, avatar, password } = req.body

    const userFound = await Admin.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const admin = new Admin({
      firstName,
      lastName,
      email,
      avatar,
      password: hash,
      role: "Admin",
    })

    await admin.save()
    res.send("new admin created")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/add-doctor", validateBody(signupJoi), checkAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, avatar, password } = req.body

    const userFound = await Admin.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new Admin({
      firstName,
      lastName,
      email,
      avatar,
      password: hash,
      role: "Doctor",
    })

    await user.save()
    res.send("new user of doctor created")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/login-admin", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin) return res.status(404).send("user not found")
    if (admin.role !== "Admin") return res.status(403).send("you are not admin")
    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(400).send("password not correct")

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/login-doctor", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const userDoctor = await Admin.findOne({ email })

    if (!userDoctor) return res.status(404).send("user not found")
    if (userDoctor.role !== "Doctor") return res.status(403).send("you are not Doctor")
    const valid = await bcrypt.compare(password, userDoctor.password)
    if (!valid) return res.status(400).send("password not correct")

    const token = jwt.sign({ id: userDoctor._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/profile", checkToken, async (req, res) => {
  try {
    const userAdmin = await Admin.findById(req.userId).select("-__v -password")
    res.json(userAdmin)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
