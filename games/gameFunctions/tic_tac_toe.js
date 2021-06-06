const TicTacToe = require('../gameModels/tic_tac_toe')

const tic_tac_toe_Create = async (userIDs) => {
    const ticTac = await TicTacToe.findOne({userID: userIDs})
    if(ticTac){
        return 'Game in progress, wanna continue? If so reply: !Continue tic_tac_toe'
    }
    else{
        const ticTacToe = new TicTacToe({
            userID: userIDs
        })
        try{
            await ticTacToe.save()
            return 'Begining game'
        }catch{
            return 'Error saving user'
        }
    }
}

const tic_tac_toe_Move = (move) => {

}

module.exports = {
    tic_tac_toe_Create,
    tic_tac_toe_Move
}