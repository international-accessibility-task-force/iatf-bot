require('dotenv').config()

import {
  Client,
  GatewayIntentBits,
  Interaction,
  Message,
  TextChannel,
  GuildMemberRoleManager,
} from 'discord.js'

import { CHANNELS, ROLES } from './utils/ids'
import { keepAlive } from './utils/server'

import Bot from './classes/Bot'
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
  const serverRolesChannel = client.channels.cache.get(CHANNELS?.serverroles)
  const logChannel = client.channels.cache.get(CHANNELS?.iatfbotlog)

  const bot = new Bot(message, logChannel as TextChannel)
  await bot.channelClear()
  await bot.channelClearBotOnly()
  await bot.createRoleButtons(serverRolesChannel)

  console.log(logChannel?.id, message.content)
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
