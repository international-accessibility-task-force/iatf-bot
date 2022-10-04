require('dotenv').config()

import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  Interaction,
  Message,
  TextChannel,
  PermissionResolvable,
  ButtonBuilder,
  GuildMemberRoleManager,
  Role,
} from 'discord.js'

import { CHANNELS, ROLES } from './utils/ids'
import { keepAlive } from './utils/server'
import { buttonFactory } from './utils/factory'

import Bot from './classes/Bot'
import copy from './data/copy.json'
import { Roles } from './types/interfaces'

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

client.on('messageCreate', async (msg: Message) => {
  const message = msg
  const messageChannel = msg.channel
  const messageAuthor = msg.author
  const messageAuthorRoles = msg.member?.roles.cache.map(
    (role: Role) => role.name
  )
  const messageContent = msg.content
  const channelMessages = await msg.channel.messages.channel.messages.fetch({
    limit: 100,
  })
  const logsChannel = client.channels.cache.get(CHANNELS?.iatfbotlog)

  const bot = new Bot(
    message,
    messageChannel as TextChannel,
    messageAuthor,
    messageAuthorRoles,
    messageContent,
    channelMessages,
    logsChannel as TextChannel
  )

  await bot.channelClear()
  await bot.channelClearBotOnly()

  console.log(
    messageAuthor.username,
    messageChannel.id,
    messageAuthorRoles,
    messageContent
  )
})

client.on('messageCreate', async (msg: Message) => {
  if (
    msg.content === 'create_get_roles_button' &&
    msg.member?.permissions.has('ADMINISTRATOR' as PermissionResolvable)
  ) {
    const testChannel = client.channels.cache.get(CHANNELS.test) as TextChannel
    if (testChannel === undefined) return

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isButton()) return
  if (interaction === null) return
  const key = interaction.customId as keyof Roles
  const role = interaction.guild?.roles.cache.get(ROLES[key])
  const memberRoles = interaction.member?.roles as GuildMemberRoleManager

  if (role === undefined) return
  const memberHasRole = memberRoles.cache.has(role.id)

  if (memberHasRole) {
    try {
      await memberRoles.remove(role)
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
      await memberRoles.add(role)
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
