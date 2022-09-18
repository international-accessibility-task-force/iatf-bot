require('dotenv').config()

const { Client, GatewayIntentBits } = require('discord.js')

const keepAlive = require('./utils/server.js')
const Bot = require('./classes/Bot.js')

const token = process.env.TOKEN

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
})

client.once('ready', () => {
  console.log('IATF-BOT, ready is up and running!')
})

client.on('messageCreate', async (msg) => {
  const message = msg
  const messageGuild = msg.guild
  const messageChannel = msg.channel
  const messageAuthor = msg.author
  const messageAuthorRoles = msg.member.roles.cache.map((role) => role.name)
  const messageContent = msg.content
  const channelMessages = await msg.channel.messages.channel.messages.fetch({ limit: 100 })
  const logsChannel = client.channels.cache.get('1018843354705956956')

  const bot = new Bot(message, messageGuild, messageChannel, messageAuthor, messageAuthorRoles, messageContent, channelMessages, client, logsChannel)

  await bot.channelClear()
  await bot.channelClearBotOnly()

  console.log(messageAuthor.username, messageChannel.name, messageAuthorRoles, messageContent)
})

keepAlive()

client.login(token)
