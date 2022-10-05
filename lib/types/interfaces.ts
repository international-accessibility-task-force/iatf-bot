import { Message, TextChannel } from 'discord.js'

export interface BotClass {
  message: Message
  logChannel: TextChannel
}

export interface Channels {
  test: string
  iatfbotlog: string
  serverroles: string
}

export interface Roles {
  Developer: string
  Community: string
  User: string
}
