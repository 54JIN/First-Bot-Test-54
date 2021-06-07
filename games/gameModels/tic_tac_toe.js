const mongoose = require('mongoose')

const tic_tac_toeSchema = new mongoose.Schema({
    user1ID: {
        type: String
    },
    user2ID: {
        type: String
    },
    topLeft: {
        type: String
    },
    topMiddle: {
        type: String
    },
    topRight: {
        type: String
    },
    left: {
        type: String
    },
    middle: {
        type: String
    },
    right: {
        type: String
    },
    botLeft: {
        type: String
    },
    botMiddle: {
        type: String
    },
    botRight: {
        type: String
    }
})

const TicTacToe = mongoose.model('TicTacToe', tic_tac_toeSchema)

module.exports = TicTacToe