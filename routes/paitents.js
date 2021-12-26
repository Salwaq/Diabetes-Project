const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Paitent, loginJoi, signupJoi } = require("../models/Paitent")
const { infoPaitent, infoPaitentJoi, addCdJoy } = require("../models/infoPaitent")
const { Question, questionJoi } = require("../models/Question")
require("dotenv").config()
const validateBody = require("../midllewere/validateBody")
const checkId = require("../midllewere/checkId")
const checkAdmin = require("../midllewere/checkAdmin")
const checkDoctor = require("../midllewere/checkDoctor")
const { Doctor } = require("../models/Doctor")
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
      doctor,
    } = req.body

    const userFound = await Paitent.findOne({ email })
    if (userFound) return res.status(400).json("user not found ")
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    let Mnr = Math.floor(Math.random() * 1000000)
    let MnrFound = await Paitent.findOne({ MNR })

    while (MnrFound == true) {
      Mnr = Math.floor(Math.random() * 1000000)
      MnrFound = await Paitent.findOne({ MNR })
    }

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
      doctor,
    })

    await Doctor.findByIdAndUpdate(doctor, { $push: { paitents: user._id } })

    await user.save()
    res.send(user)
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

    const userPaitent = await Paitent.findById(req.userId)
      .select("-__v -password")
      .populate("infoPaitent")
      .populate("doctor")
      .populate("visits")
      .populate("questions")
    res.json(userPaitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/", async (req, res) => {
  try {
    const paitent = await Paitent.find()
      .populate("infoPaitent")
      .populate("doctor")
      .populate("visits")
      .populate("questions")
    res.json(paitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/:paitentId", checkId("paitentId"), async (req, res) => {
  try {
    const paitent = await Paitent.findById(req.params.paitentId)
      .populate("infoPaitent")
      .populate("visits")
      .populate("doctor")
      .populate("questions")
    if (!paitent) return res.status(404).send("paitent not found")
    res.json(paitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.delete("/:paitentId", checkAdmin, checkId("paitentId"), async (req, res) => {
  try {
    const paitent = await Paitent.findByIdAndRemove(req.params.paitentId)
    if (!paitent) return res.status(400).json("paitent not found")
    res.json("paitent removed")
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

// ___________________________________informaition_______________________________________________

router.post("/:paitentId/info", checkDoctor, checkId("paitentId"), validateBody(infoPaitentJoi), async (req, res) => {
  try {
    const { bloodType, weight, height, diabetesType } = req.body
    const paitent = await Paitent.findById(req.params.paitentId)
    if (!paitent) return res.status(404).send("film not found")

    const informaitionPaitent = new infoPaitent({
      bloodType,
      weight,
      height,
      diabetesType,
      paitentId: req.params.paitentId,
    })

    await Paitent.findByIdAndUpdate(
      req.params.paitentId,
      { $set: { infoPaitent: informaitionPaitent._id } },
      { new: true }
    )
    await informaitionPaitent.save()
    res.json(informaitionPaitent)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//____________________________Q?__________________________________
router.post("/:userId/questions", checkId("userId"), checkToken, validateBody(questionJoi), async (req, res) => {
  try {
    const { question } = req.body

    const doctor = await Doctor.findById(req.params.userId)
    if (!doctor) return res.status(404).send("doctor not found")

    const newQuestion = new Question({ question, doctor: req.params.userId, paitent: req.paitentId })

    await Doctor.findByIdAndUpdate(req.params.userId, { $push: { questions: newQuestion._id } }, { new: true })

    await Paitent.findByIdAndUpdate(req.paitentId, { $push: { questions: newQuestion._id } }, { new: true })

    //بعد صنع الكومنت اضيفه للاراي حقتو الاساسيه الكومنت اراي
    //فتجينا مع قيت فيلم << نحط بوبيوليت كومنس  بالفيلم

    await newQuestion.save()
    res.json(newQuestion)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

// _________________________________average cumulative Diabetes_____________________________________

router.post("/:paitentId/info/cd", checkDoctor, checkId("paitentId"), validateBody(addCdJoy), async (req, res) => {
  try {
    let paitent = await Paitent.findById(req.params.paitentId)
    if (!paitent) return res.status(404).send("paitent not found")

    const { cumulativeDiabetes } = req.body

    //add infop

    const newCD = {
      cumulativeDiabetes,
      paitentId: req.paitentId,
    }

    let infopaitent = await infoPaitent.findByIdAndUpdate(
      paitent.infoPaitent,
      { $push: { cumulativeDiabetes: newCD } },
      { new: true }
    )

    // calculate average

    let total = 0
    infopaitent.cumulativeDiabetes.forEach(cumulativeDiabete => {
      total += cumulativeDiabete.cumulativeDiabetes
    })
    console.log("total" + total)

    const CdAverage = total / infopaitent.cumulativeDiabetes.length

    paitent = await infoPaitent.findByIdAndUpdate(paitent.infoPaitent, { $set: { CdAverage } }, { new: true })

    res.send(paitent)
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})

module.exports = router
