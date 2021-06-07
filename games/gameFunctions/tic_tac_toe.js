const TicTacToe = require('../gameModels/tic_tac_toe')

const tic_tac_toe_Print = async (player1, player2) => {
    const ticTacGame = await TicTacToe.findOne({user1ID: player1, user2ID: player2})
    const topLeft = await ticTacGame.topLeft
    const topMiddle = await ticTacGame.topMiddle
    const topRight = await ticTacGame.topRight
    const left = await ticTacGame.left
    const middle = await ticTacGame.middle
    const right = await ticTacGame.right
    const botLeft = await ticTacGame.botLeft
    const botMiddle = await ticTacGame.botMiddle
    const botRight = await ticTacGame.botRight
    return `\n${topLeft}|${topMiddle}|${topRight}\n${left}|${middle}|${right}\n${botLeft}|${botMiddle}|${botRight}`
}

const tic_tac_toe_InProgress = async (user1IDs, user2IDs) => {
    if(await TicTacToe.findOne({user1ID: user1IDs, user2ID: user2IDs})){
        return await TicTacToe.findOne({user1ID: user1IDs, user2ID: user2IDs})
    }
    else if(await TicTacToe.findOne({user1ID: user2IDs, user2ID: user1IDs})){
        return await TicTacToe.findOne({user1ID: user2IDs, user2ID: user1IDs})
    }
    else{
        return null
    }
}

const tic_tac_toe_Create = async (user1IDs, user2IDs) => {
    const ticTac = await tic_tac_toe_InProgress(user1IDs, user2IDs)
    if(ticTac){
        return 'Game in progress, wanna Reset? If so reply: !tic_tac_toe reset @mention'
    }
    else{
        const ticTacToe = new TicTacToe({
            user1ID: user1IDs,
            user2ID: user2IDs,
            topLeft: '📦',
            topMiddle: '📦',
            topRight: '📦',
            left: '📦',
            middle: '📦',
            right: '📦',
            botLeft: '📦',
            botMiddle: '📦',
            botRight: '📦'
        })
        try{
            await ticTacToe.save()
            return `Begining game\n${await tic_tac_toe_Print(user1IDs, user2IDs)}`
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


const tic_tac_toe_Move = async (user1IDs, user2IDs, move, player) => {
    const ticTacGameInProgress = await tic_tac_toe_InProgress(user1IDs, user2IDs)

    user1IDs = ticTacGameInProgress.user1ID
    user2IDs = ticTacGameInProgress.user2ID

    const playerPiece = user1IDs == player? 'X': user2IDs == player? 'O': '📦'
    try{
        if(playerPiece == '📦'){
            throw new Error('Player not found')
        }
        if(move == 'topLeft'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topLeft: playerPiece})
            await game.save()
        }
        else if(move == 'topMid'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topMiddle: playerPiece})
            await game.save()
        }
        else if(move == 'topRight'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topRight: playerPiece})
            await game.save()
        }
        else if(move == 'left'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{left: playerPiece})
            await game.save()
        }
        else if(move == 'middle'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{middle: playerPiece})
            await game.save()
        }
        else if(move == 'right'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{right: playerPiece})
            await game.save()
        }
        else if(move == 'botLeft'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botLeft: playerPiece})
            await game.save()
        }
        else if(move == 'botMid'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botMiddle: playerPiece})
            await game.save()
        }
        else if(move == 'botRight'){
            const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botRight: playerPiece})
            await game.save()
        }
        return `${await tic_tac_toe_Print(user1IDs, user2IDs)}`
    }catch (e) {
        return 'Error! Try Again'
    }
}

module.exports = {
    tic_tac_toe_Create,
    tic_tac_toe_Reset,
    tic_tac_toe_Move
}