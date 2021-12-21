const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Doctor, loginJoi, signupJoi } = require("../models/Doctor")

require("dotenv").config()
const validateBody = require("../midllewere/validateBody")
const checkAdmin = require("../midllewere/checkAdmin")
const checkToken = require("../midllewere/checkToken")
const checkId = require("../midllewere/checkId")
const { Visit, visitJoi } = require("../models/Visit")
const checkDoctor = require("../midllewere/checkDoctor")
const mongoose = require("mongoose")

router.post("/add-doctor", validateBody(signupJoi), checkAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, avatar, password } = req.body

    const userFound = await Doctor.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new Doctor({
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

router.post("/login-doctor", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const userDoctor = await Doctor.findOne({ email })

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

router.get("/:id", checkId, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("visit")
    if (!doctor) return res.status(404).send("doctor not found")
    res.json(doctor)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// ________________________Visit___________________________
router.get("/:idDoctor/visit", async (req, res) => {
  try {
    const id = req.params.idDoctor
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send(`the path idDoctor is not valid opjectid`) /// checkId
    const doctor = await Doctor.findById(req.params.idDoctor)
    if (!doctor) return res.status(404).send("doctor not found")

    const visit = await Visit.find({ doctor: req.params.id })
    res.json(visit)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
router.post("/:idDoctor/visit", checkDoctor, validateBody(visitJoi), async (req, res) => {
  try {
    const { date } = req.body
    const id = req.params.idDoctor
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send(`the path idDoctor is not valid opjectid`) /// checkId
    const doctor = await Doctor.findById(req.params.idDoctor)
    if (!doctor) return res.status(404).send("doctor not found")

    const newVisit = new Visit({ date, idDoctor: req.params.idDoctor })
    await Doctor.findByIdAndUpdate(req.params.idDoctor, { $push: { visit: newVisit._id } })

    await newVisit.save()
    res.json(newVisit)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
