const TicTacToe = require('../gameModels/tic_tac_toe')

const tic_tac_toe = (name) => {
    const ticTacToe = new TicTacToe({
        name,
        age: 12
    })
    ticTacToe.save().then(() => {
        
    }).catch((e) => {
        
    })
}

module.exports = tic_tac_toe