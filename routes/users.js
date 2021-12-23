const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Admin, loginJoi, signupJoi } = require("../models/Admin")
require("dotenv").config()
const validateBody = require("../midllewere/validateBody")
const checkAdmin = require("../midllewere/checkAdmin")
const { Paitent } = require("../models/Paitent")
const { Doctor } = require("../models/Doctor")
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

router.get("/profile", checkAdmin, async (req, res) => {
  try {
    const userAdmin = await Admin.findById(req.userId).select("-__v -password")
    res.json(userAdmin)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//__________________ change Dr ________________________

router.get("/:paitentId/changedr/:doctorId", checkAdmin, async (req, res) => {
  try {
    const paitent = await Paitent.findById(req.params.paitentId)
    if (!paitent) return res.status(404).send("paitent not found")

    let oldDr = await Doctor.findById(paitent.doctor)
    if (!oldDr) return res.status(404).send("doctor not found")

    oldDr = await Doctor.findByIdAndUpdate(paitent.doctor, { $pull: { paitents: req.params.paitentId } }, { new: true })
    await Paitent.findByIdAndUpdate(req.params.paitentId, { $set: { doctor: req.params.doctorId } }, { new: true })

    res.json("change Dr")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
