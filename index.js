const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const Joi = require("joi")
const JoiObjectId = require("joi-objectid")
Joi.Objectid = JoiObjectId(Joi)
const users = require("./routes/users")
// const visits = require("./routes/visits")
const paitents = require("./routes/paitents")
const doctors = require("./routes/doctors")

mongoose
  .connect(`mongodb://localhost:27017/projectDB`)
  .then(() => console.log("Conected to MongoosDB"))
  .catch(error => console.log("Error connecting", error))

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", users)
// app.use("/api/visit", visits)
app.use("/api/paitent", paitents)

app.use("/api/doctors", doctors)

const port = 8000
app.listen(port, () => {
  console.log("server is listening on port :" + port)
})
