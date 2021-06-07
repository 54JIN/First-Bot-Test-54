const TicTacToe = require('../gameModels/tic_tac_toe')

const tic_tac_toe_Create = async (user1IDs, user2IDs) => {
    const ticTac = await TicTacToe.findOne({user1ID: user1IDs, user2ID: user2IDs})
    if(ticTac){
        return 'Game in progress, wanna continue? If so reply: !Continue tic_tac_toe'
    }
    else{
        const ticTacToe = new TicTacToe({
            user1ID: user1IDs,
            user2ID: user2IDs
        })
        try{
            await ticTacToe.save()
            return 'Begining game\n📦|📦|📦\n📦|📦|📦\n📦|📦|📦'
        }catch{
            return 'Error saving user'
        }
    }
}

const tic_tac_toe_Reset = async (user1IDs, user2IDs) => {
    try{
        await TicTacToe.findOneAndRemove({user1ID: user1IDs, user2IDs})
        return 'Reset Game'
    }catch(e){
        return 'Error reseting user'
    }
}


const tic_tac_toe_Move = (move) => {

}

module.exports = {
    tic_tac_toe_Create,
    tic_tac_toe_Reset,
    tic_tac_toe_Move
}