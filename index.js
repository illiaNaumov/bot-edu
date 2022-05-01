const TelegramApi = require('node-telegram-bot-api')
const token = '5360860969:AAEJUa_mmfzJ82uLNhYzAaXi07pnbaqJcbs'
const {gameOptions, againOptions} = require('./options')

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now a will guess a number from 0 to 9. ')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Now guess. Your turn', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Begin work with this chat bot'},
        {command: '/info', description: 'Receive info about user'},
        {command: '/game', description: 'Guess a number game'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        console.log(msg)

        if (text === '/start') {
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAM-Ym5RGNZoJ2T4YeMvN6VwXtn4TDYAAkcWAAJRjRFL3kcssbniqfUkBA')
            return bot.sendMessage(chatId, `Добро пожаловать в Телеграм бот`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, `I don\'t understand you, try again`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(`data=${data}, bot=${chats[chatId]}`)

        if (data === `/again`) {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `You've guessed the number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Unfortunately, you haven't guessed the number. Bot guessed ${chats[chatId]}`, againOptions)
        }
    })
}

start()