const jwt = require("jsonwebtoken")
const { Paitent } = require("../models/Paitent")

const checkToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is required")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const paitentId = decryptedToken.id

    const user = await Paitent.findById(paitentId)
    if (!user) return res.status(400).json("user not found")
    req.paitentId = paitentId

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
}

module.exports = checkToken
