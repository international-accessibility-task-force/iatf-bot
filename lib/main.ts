require('dotenv').config()

const { Client, GatewayIntentBits, ActionRowBuilder } = require('discord.js')

const { CHANNELS, ROLES } = require('./utils/ids')
const { keepAlive } = require('./utils/server.ts')
const { buttonFactory } = require('./utils/factory.ts')

const Bot = require('./classes/Bot.ts')
const copy = require('./data/copy.json')

const token = process.env.TOKEN

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.once('ready', () => {
  console.log('IATF-BOT, up and running! 🚀')
})

client.on('messageCreate', async (msg) => {
  const message = msg
  const messageGuild = msg.guild
  const messageChannel = msg.channel
  const messageAuthor = msg.author
  const messageAuthorRoles = msg.member.roles.cache.map((role) => role.name)
  const messageContent = msg.content
  const channelMessages = await msg.channel.messages.channel.messages.fetch({
    limit: 100,
  })
  const logsChannel = client.channels.cache.get('1018843354705956956')

  const bot = new Bot(
    message,
    messageGuild,
    messageChannel,
    messageAuthor,
    messageAuthorRoles,
    messageContent,
    channelMessages,
    client,
    logsChannel
  )

  await bot.channelClear()
  await bot.channelClearBotOnly()

  console.log(
    messageAuthor.username,
    messageChannel.name,
    messageAuthorRoles,
    messageContent
  )
})

client.on('messageCreate', async (msg) => {
  if (
    msg.content === 'create_get_roles_button' &&
    msg.member.permissions.has('ADMINISTRATOR')
  ) {
    const testChannel = client.channels.cache.get(CHANNELS.test)

    const row = new ActionRowBuilder().addComponents(
      buttonFactory('Community'),
      buttonFactory('User'),
      buttonFactory('Developer')
    )

    await testChannel.send({
      content: `${copy.get_roles_message}`,
      components: [row],
    })
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  const role = interaction.guild.roles.cache.get(ROLES[interaction.customId])
  const hasRole = interaction.member.roles.cache.has(role.id)

  if (hasRole) {
    try {
      await interaction.member.roles.remove(role)
      await interaction.reply({
        content: `Removed role ${role}`,
        ephemeral: true,
      })
    } catch (err) {
      console.log(err)
      await interaction.reply({
        content: `Something went wrong. The ${role} role was not removed.`,
        ephemeral: true,
      })
    }
  } else {
    try {
      await interaction.member.roles.add(role)
      await interaction.reply({
        content: `Added ${role}`,
        ephemeral: true,
      })
    } catch (err) {
      console.log(err)
      await interaction.reply({
        content: `Something went wrong. The ${role} role was not removed.`,
        ephemeral: true,
      })
    }
  }
})

keepAlive()

client.login(token)
