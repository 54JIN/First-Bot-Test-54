require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URl, {
    useNewUrlParser: true
})