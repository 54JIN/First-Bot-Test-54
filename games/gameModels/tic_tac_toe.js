const mongoose = require('mongoose')

const tic_tac_toeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const TicTacToe = mongoose.model('TicTacToe', tic_tac_toeSchema)

module.exports = TicTacToe