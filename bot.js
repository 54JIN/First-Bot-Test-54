require('dotenv').config()
require('./db/mongoose')

const Discord = require('discord.js')
const client = new Discord.Client()
const request = require(`request`)
const stock_price = require('./utils/stock_price')
const {tic_tac_toe_Create, tic_tac_toe_Move, tic_tac_toe_Reset} = require('./games/gameFunctions/tic_tac_toe')

const RED_ROLE = '850374490218299453';
const BLUE_ROLE = '850375387530919966';
const GREEN_ROLE = '850375438458814524';

client.on('ready', () => {
    console.log('Our bot is ready to go!!!!')
})

client.on('message', async (message) => {

    /* split the content of the command from discord chat line */
    const parts = message.content.split(' ');

    /* All the commands of the bot */
    if(parts[0] == '!commands'){
        message.reply('!addRole\n!rmRole\n!stock\n!games')
    }
    
    /* Adding roles to users */
    else if (parts[0] == '!addRole') {
        if(!message.member.hasPermission('MANAGE_ROLES')){
            message.reply('Sorry pal you don\'t have permission to do that! 😢')
        }
        else{
            let rMember = message.guild.member(message.mentions.users.first()) || message.member
            for(let i = 1; i < parts.length; i++){
                const role = parts[i] == 'red'? RED_ROLE : parts[i] == 'blue'? BLUE_ROLE : parts[i] == 'green'? GREEN_ROLE : null;
                if(role != null){
                    rMember.roles.add(role);
                }
            }
        }
    }

    /* Removing roles to users */
    else if(parts[0] =='!rmRole'){
        if(!message.member.hasPermission('MANAGE_ROLES')){
            message.reply('Sorry pal you don\'t have permission to do that! 😢')
        }
        else{
            let rMember = message.guild.member(message.mentions.users.first()) || message.member
            for(let i = 1; i < parts.length; i++){
                const role = parts[i] == 'red'? RED_ROLE : parts[i] == 'blue'? BLUE_ROLE : parts[i] == 'green'? GREEN_ROLE : null;
                if(role != null){
                    rMember.roles.remove(role);
                }
            }
        }
    }

    /* Games */
    else if(parts[0] == '!games'){
        message.reply('!tic_tac_toe')
    }

    /* Tic Tac Toe */
    else if(parts[0] == '!tic_tac_toe'){
        if(parts[1] == 'reset'){
            let result = await tic_tac_toe_Reset(message.author.id, message.mentions.members.first().id)
            message.reply(result)
        }
        else if(parts[1] == 'multiplayer' && message.mentions.members.first().id){
            let result = await tic_tac_toe_Create(message.author.id, message.mentions.members.first().id)
            message.reply(result)
        }
        else if(parts[1] == 'topLeft'|| parts[1] == 'topMid'|| parts[1] == 'topRight'|| parts[1] == 'left'|| parts[1] == 'middle'|| parts[1] == 'right'|| parts[1] == 'botLeft'|| parts[1] == 'botMid'|| parts[1] == 'botRight' && message.mentions.members.first().id){
            let result = await tic_tac_toe_Move(message.author.id, message.mentions.members.first().id, parts[1], message.author.id)
            message.reply(result)
        }
        else if(parts[1] == 'commands'){
            message.reply('\n!tic_tac_toe multiplayer @mentionPlayer\n!tic_tac_toe reset @mentionPlayer\n!tic_tac_toe (topLeft or topMid or topRight or left or middle or right or botLeft or botMid or botRight) @mentionPlayer')
        }
    }

    /* Stocks */
    else if(parts[0] == '!stock'){
        stock_price(parts[1],(res) => {
            if(res == 'Unable to connect to IEX-stock API!' || res == 'Please type in a valid company stock symbol!'){
                message.reply(res);
            }
            else{
                message.reply(`Symbol: ${res.symbol}\nDate: ${res.date}\nOpen: ${res.open}\nClose: ${res.close}\nHigh: ${res.high}`);
            }
        })
    }
})

client.login(process.env.BOT_TOKEN)