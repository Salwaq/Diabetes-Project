const jwt = require("jsonwebtoken")
const { Doctor } = require("../models/Doctor")

const checkDoctor = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is required")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const DoctorUser = await Doctor.findById(userId)
    if (!DoctorUser) return res.status(404).json("DoctorUser not found")

    if (DoctorUser.role !== "Doctor") return res.status(403).send("you are not Doctor")

    req.userId = userId

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
}

module.exports = checkDoctor
