const TicTacToe = require('../gameModels/tic_tac_toe')

const tic_tac_toe_Print = async (player1, player2) => {
    try{
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
    } catch(e){
        return ' Game Not Found'
    }
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

const tic_tac_toe_Finished = async (user1IDs, user2IDs) => {
    try{
        const ticTacGameInProgress = await tic_tac_toe_InProgress(user1IDs, user2IDs)
        
        if(ticTacGameInProgress == null){
            throw new Error()
        }
        if(ticTacGameInProgress.topLeft == ticTacGameInProgress.topMiddle && ticTacGameInProgress.topLeft == ticTacGameInProgress.topRight && ticTacGameInProgress.topLeft != '📦'){
            return `\n${ticTacGameInProgress.topLeft} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topLeft == ticTacGameInProgress.middle && ticTacGameInProgress.topLeft == ticTacGameInProgress.botRight && ticTacGameInProgress.topLeft != '📦'){
            return `\n${ticTacGameInProgress.topLeft} Won the Game!!!`
        }
        else if(ticTacGameInProgress.left == ticTacGameInProgress.middle && ticTacGameInProgress.left == ticTacGameInProgress.right && ticTacGameInProgress.left != '📦'){
            return `\n${ticTacGameInProgress.left} Won the Game!!!`
        }
        else if(ticTacGameInProgress.botLeft == ticTacGameInProgress.botMiddle && ticTacGameInProgress.botLeft == ticTacGameInProgress.botRight && ticTacGameInProgress.botLeft != '📦'){
            return `\n${ticTacGameInProgress.botLeft} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topMiddle == ticTacGameInProgress.middle && ticTacGameInProgress.topMiddle == ticTacGameInProgress.botMiddle && ticTacGameInProgress.topMiddle != '📦'){
            return `\n${ticTacGameInProgress.topMiddle} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topRight == ticTacGameInProgress.right && ticTacGameInProgress.topRight == ticTacGameInProgress.botRight && ticTacGameInProgress.topRight != '📦'){
            return `\n${ticTacGameInProgress.topRight} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topLeft == ticTacGameInProgress.left && ticTacGameInProgress.topLeft == ticTacGameInProgress.botLeft && ticTacGameInProgress.topLeft != '📦'){
            return `\n${ticTacGameInProgress.topLeft} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topRight == ticTacGameInProgress.middle && ticTacGameInProgress.topRight == ticTacGameInProgress.botLeft && ticTacGameInProgress.topRight != '📦'){
            return `\n${ticTacGameInProgress.topRight} Won the Game!!!`
        }
        else if(ticTacGameInProgress.topRight != '📦' && ticTacGameInProgress.topMiddle != '📦' && ticTacGameInProgress.topLeft != '📦' && ticTacGameInProgress.left != '📦' && ticTacGameInProgress.middle != '📦' && ticTacGameInProgress.right != '📦' && ticTacGameInProgress.botLeft != '📦' && ticTacGameInProgress.botMiddle != '📦' && ticTacGameInProgress.botRight != '📦'){
            return '\nGame Over No One Won 😢'
        }
        else{
            return null
        }
    } catch(e){
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
        const ticTacGameInProgress = await tic_tac_toe_InProgress(user1IDs, user2IDs)
        
        if(ticTacGameInProgress == null){
            throw new Error()
        }

        user1IDs = ticTacGameInProgress.user1ID
        user2IDs = ticTacGameInProgress.user2ID

        await TicTacToe.findOneAndRemove({user1ID: user1IDs, user2ID: user2IDs})
        return 'Reset Game'
    } catch(e){
        return 'Error Reseting Game!'
    }
}


const tic_tac_toe_Move = async (user1IDs, user2IDs, move, player) => {
    try{
        const ticTacGameInProgress = await tic_tac_toe_InProgress(user1IDs, user2IDs)

        if(ticTacGameInProgress == null){
            throw new Error()
        }

        user1IDs = ticTacGameInProgress.user1ID
        user2IDs = ticTacGameInProgress.user2ID

        const playerPiece = user1IDs == player? 'X': user2IDs == player? 'O': '📦'

        if(playerPiece == '📦'){
            throw new Error('Player not found')
        }
        if(move == 'topLeft'){
            if(ticTacGameInProgress.topLeft != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topLeft: playerPiece})
                await game.save()
            }
        }
        else if(move == 'topMid'){
            if(ticTacGameInProgress.topMiddle != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topMiddle: playerPiece})
                await game.save()
            }
        }
        else if(move == 'topRight'){
            if(ticTacGameInProgress.topRight != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{topRight: playerPiece})
                await game.save()
            }
        }
        else if(move == 'left'){
            if(ticTacGameInProgress.left != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{left: playerPiece})
                await game.save()
            }
        }
        else if(move == 'middle'){
            if(ticTacGameInProgress.middle != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{middle: playerPiece})
                await game.save()
            }
        }
        else if(move == 'right'){
            if(ticTacGameInProgress.right != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{right: playerPiece})
                await game.save()
            }
        }
        else if(move == 'botLeft'){
            if(ticTacGameInProgress.botLeft != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botLeft: playerPiece})
                await game.save()
            }
        }
        else if(move == 'botMid'){
            if(ticTacGameInProgress.botMiddle != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botMiddle: playerPiece})
                await game.save()
            }
        }
        else if(move == 'botRight'){
            if(ticTacGameInProgress.botRight != '📦'){
                throw new Error('Move already made!')
            }
            else{
                const game = await TicTacToe.findOneAndUpdate({user1ID: user1IDs, user2ID: user2IDs},{botRight: playerPiece})
                await game.save()
            }
        }
        const gameFinished = await tic_tac_toe_Finished(user1IDs, user2IDs)
        if(gameFinished){
            const returnResult = `${await tic_tac_toe_Print(user1IDs, user2IDs)}\n${gameFinished}`
            await tic_tac_toe_Reset(user1IDs, user2IDs)
            return returnResult
        }
        else{
            return `${await tic_tac_toe_Print(user1IDs, user2IDs)}`
        }
    }catch (e) {
        return `${e}${await tic_tac_toe_Print(user1IDs, user2IDs)}`
    }
}

module.exports = {
    tic_tac_toe_Create,
    tic_tac_toe_Reset,
    tic_tac_toe_Move
}