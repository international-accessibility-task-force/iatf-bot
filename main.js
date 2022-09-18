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
  const guild = await client.guilds.cache.get('1014599739230130267')
  const member = await guild.members.fetch(msg.author)
  const logs = await client.channels.cache.get('1018843354705956956')
  const channelMessages = await msg.channel.messages.channel.messages.fetch({ limit: 100 })
  const authorRoles = await member.roles.cache.map((role) => role.name)
  const bot = new Bot(msg, msg.guild, msg.channel, msg.author, authorRoles, msg.content, channelMessages, client, logs)

  await bot.channelClear()
  await bot.channelClearBotOnly()
  //await bot.awaitingVerification() standby this feature
})

keepAlive()

client.login(token)
