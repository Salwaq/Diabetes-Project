const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Paitent, loginJoi, signupJoi, profileJoi, infoPaitentJoi, addCdJoy } = require("../models/Paitent")
require("dotenv").config()
const validateBody = require("../midllewere/validateBody")
const checkId = require("../midllewere/checkId")
const checkAdmin = require("../midllewere/checkAdmin")
const checkDoctor = require("../midllewere/checkDoctor")
const checkToken = require("../midllewere/checkToken")

router.post("/signup", checkAdmin, validateBody(signupJoi), async (req, res) => {
  try {
    const {
      firstName,
      midName,
      lastName,
      email,
      avatar,
      password,
      gendar,
      insurance,
      phoneNumber,
      smoking,
      MNR,
      doctorId,
    } = req.body

    const userFound = await Paitent.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    let Mnr = Math.floor(Math.random() * 1000000)
    const MnrFound = await Paitent.findOne({ MNR })
    if (MnrFound) Mnr = Math.floor(Math.random() * 1000000)

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
      MNR: Mnr,
      doctorId,
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

router.get("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is required")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const user = await Paitent.findById(userId)
    if (!user) return res.status(400).json("user not found")
    req.userId = userId

    const userPaitent = await Paitent.findById(req.userId).select("-__v -password")
    res.json(userPaitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/", async (req, res) => {
  try {
    const paitent = await Paitent.find()
    res.json(paitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/:id", checkId, async (req, res) => {
  try {
    const paitent = await Paitent.findById(req.params.id)
    if (!paitent) return res.status(404).send("paitent not found")
    res.json(paitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.delete("/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const paitent = await Paitent.findByIdAndRemove(req.params.id)
    if (!paitent) return res.status(400).json("paitent not found")
    res.json("paitent removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

router.get("/:id/info", validateBody(infoPaitentJoi), checkId, async (req, res) => {
  try {
    const paitentInfo = await Paitent.findById(req.params.id)
    if (!paitentInfo) return res.status(404).send("paitentInfo not found")

    res.json(paitentInfo)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/:id/info", checkDoctor, checkId, async (req, res) => {
  try {
    const { bloodType, weight, height, diabetesType } = req.body

    const infoPaitent = new Paitent({
      bloodType,
      weight,
      height,
      diabetesType,
    })

    await infoPaitent.save()
    res.json(infoPaitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/:id/cd", checkDoctor, checkId, validateBody(addCdJoy), async (req, res) => {
  try {
    let paitent = await Paitent.findById(req.params.paitentId)
    if (!paitent) return res.status(404).send("paitent not found")

    const { cumulativeDiabetes } = req.body
    const newCD = {
      cumulativeDiabetes,
      userId: req.userId,
    }

    paitent = await Paitent.findByIdAndUpdate(req.params.id, { $push: { cumulativeDiabetes: newCD } }, { new: true })

    let sum = 0
    paitent.cumulativeDiabetes.forEach(cumulativeDiabete => {
      sum += cumulativeDiabete
    })
    console.log(paitent.cumulativeDiabete)
    console.log(sum)

    const CdAverage = sum / paitent.cumulativeDiabete.length

    await Paitent.findByIdAndUpdate(req.params.id, { $set: { CdAverage } })

    res.send("Cd added")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

module.exports = router
