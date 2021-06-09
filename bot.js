require('dotenv').config()
require('./db/mongoose')

/* npm packages */
const Discord = require('discord.js')
const client = new Discord.Client()
const request = require(`request`)
const schedule = require('node-schedule')

/* Utils */
const stock_price = require('./utils/stock_price')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

/* Games */
const {tic_tac_toe_Create, tic_tac_toe_Move, tic_tac_toe_Reset} = require('./games/gameFunctions/tic_tac_toe')
const {create_Task, delete_Task, update_Task, print_Tasks} = require('./utils/task/functionality/task.js')

/* Discord ROlE IDs */
const RED_ROLE = '850374490218299453';
const BLUE_ROLE = '850375387530919966';
const GREEN_ROLE = '850375438458814524';

let amtRemind = 0

client.on('ready', () => {
    console.log('Our bot is ready to go!!!!')
})

client.on('message', async (message) => {

    /* split the content of the command from discord chat line */
    const parts = message.content.split(' ');

    /* All the commands of the bot */
    if(parts[0] == '!commands'){
        message.reply('!addRole (role)\n!rmRole (role)\n!stock (ticker, ex: AAPL)\n!games\n!weather (location)\n!task commands\n!setReminder (Displays the commands to which you can create a reminder)')
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

    /* Weather */
    else if(parts[0] == '!weather'){
        let address = ''
        for(let i = 1; i < parts.length; i++){
            address += `${parts[i]} `
        }
        geocode(address, (error, {latitude, longitude, location} = {}) => {
            if(error){
                return message.reply(error)
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if(error){
                    return message.reply(error)
                }

                message.reply(`\n${location}\n${forecastData}`)
            })
        })
    }

    /* Task Manage */
    else if(parts[0] == '!task'){
        if(parts.length > 1 && parts[1] == 'commands'){
            message.reply('\n!task /*This will print all the task currently held by you)*/\n!task toDo (Description of Task)\n!task remove (Description of task to remove)\n!task complete (Descrition of task to update to complete)\n!task uncomplete (Description of task to update to uncomplete)')
        }
        else if(parts.length > 2 && parts[1] == 'toDo' ){
            let toDoTask = ''
            for(let i = 2; i < parts.length; i++){
                toDoTask += `${parts[i]} `
            }
            const result = await create_Task(toDoTask, message.author.id)
            message.reply(result)
        }
        else if(parts.length > 2 && parts[1] == 'remove'){
            let removeTask = ''
            for(let i = 2; i < parts.length; i++){
                removeTask += `${parts[i]} `
            }
            const result = await delete_Task(removeTask, message.author.id)
            message.reply(result)
        }
        else if(parts.length > 2 && (parts[1] == 'complete' || parts[1] == 'uncomplete')){
            let toDoTask = ''
            for(let i = 2; i < parts.length; i++){
                toDoTask += `${parts[i]} `
            }
            const result = await update_Task(toDoTask, message.author.id, (parts[1] == 'complete'? true: false))
            message.reply(result)
        }
        else{
            const result = await print_Tasks(message.author.id)
            message.reply(`\n${result}`)
        }
    }

    /* Reminders */
    else if(parts[0] == '!setReminder'){
        if(parts.length > 6){
            const someDate = new Date(`${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]} ${parts[5]} GMT-0400 (Eastern Daylight Time)`)
            if(amtRemind < 2){
                let reminder = ''
                for(let i = 6; i < parts.length; i++){
                    reminder += `${parts[i]} `
                }
                amtRemind++
                schedule.scheduleJob(`${amtRemind}`,someDate, () => {
                    amtRemind--
                    message.reply(reminder)
                })
            }
            else{
                message.reply(`Too many active reminders. Max reminders allowed 2! Current amount: ${amtRemind}`)
            }
        }
        else{
            message.reply('\n!setReminder (weekDay, Ex: Monday-Sunday) (Month) (Day, Ex: 09) (Year) (Time, Ex: 01:47:50 (Hour:Minute:Second)) (Reminder Description)\n!resetReminders (resets both (2) reminders)\n!activeReminders (Displays the amount of reminders currently active)')
        }
    }
    else if(parts[0] == '!resetReminders'){
        schedule.cancelJob('1')
        schedule.cancelJob('2')
        amtRemind = 0
        message.reply(`Active Reminders: ${amtRemind}`)
    }

    else if(parts[0] == '!activeReminders'){
        message.reply(amtRemind)
    }
})

client.login(process.env.BOT_TOKEN)