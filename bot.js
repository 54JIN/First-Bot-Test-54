require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const stock_price = require('./utils/stock_price')

const RED_ROLE = '850374490218299453';
const BLUE_ROLE = '850375387530919966';
const GREEN_ROLE = '850375438458814524';

client.on('ready', () => {
    console.log('Our bot is ready to go!!!!')
})

client.on('message', (message) => {

    /* split the content of the command from discord chat line */
    const parts = message.content.split(' ');

    /* Adding roles to users */
    if (parts[0] == '!role') {
        for(let i = 1; i < parts.length; i++){
            const role = parts[i] == 'red'? RED_ROLE : parts[i] == 'blue'? BLUE_ROLE : parts[i] == 'green'? GREEN_ROLE : null;
            if(role != null){
                message.member.roles.add(role);
            }
        }
    }

    /* Stocks */
    if(parts[0] == '!stock'){
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