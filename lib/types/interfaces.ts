import { Message, TextChannel } from 'discord.js'

//TODO: map discord.js types where any
export interface BotClass {
  message: Message
  messageChannel: any
  messageAuthor: any
  messageAuthorRoles: any
  messageContent: any
  channelMessages: any
  logsChannel: TextChannel
}

export interface Channels {
  test: string
  iatfbotlog: string
}

export interface Roles {
  Developer: string
  Community: string
  User: string
}
