const mongoose = require("mongoose")

const checkId = (...idArray) => {
  return async (req, res, next) => {
    try {
      idArray.forEach(idName => {
        const id = req.params[idName]
        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(400).send(`the path ${idName} is not valid opjectid`) /// checkId
      })
      next()
    } catch (error) {
      console.log(error)
      return res.status(500).send(error.message)
    }
  }
}

module.exports = checkId
