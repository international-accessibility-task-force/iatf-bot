import { Message, TextChannel } from 'discord.js'
import { BotClass } from '../types/interfaces'

class Bot implements BotClass {
  message: Message
  messageChannel: TextChannel
  messageAuthor: any
  messageAuthorRoles: any
  messageContent: any
  channelMessages: any
  logsChannel: TextChannel

  constructor(
    message: Message,
    messageChannel: TextChannel,
    messageAuthor: any,
    messageAuthorRoles: any,
    messageContent: any,
    channelMessages: any,
    logsChannel: TextChannel
  ) {
    this.message = message
    this.messageChannel = messageChannel
    this.messageAuthor = messageAuthor
    this.messageAuthorRoles = messageAuthorRoles
    this.messageContent = messageContent
    this.channelMessages = channelMessages
    this.logsChannel = logsChannel
  }

  log = async (method: string) => {
    this.logsChannel.send({
      content: `[${method}] (${this.messageChannel}) username: ${this.messageAuthor.username}, content: ${this.messageContent}`,
    })
  }

  channelClear = async () => {
    if (
      this.messageContent === 'cls' &&
      this.messageAuthorRoles.includes('reserved')
    ) {
      await this.log('Bot::channelClear()')
      await this.messageChannel.bulkDelete(this.channelMessages, true)
    }
  }

  channelClearBotOnly = async () => {
    if (
      this.messageContent === 'clsb' &&
      this.messageAuthorRoles.includes('reserved')
    ) {
      await this.messageChannel.bulkDelete(
        this.channelMessages.filter(
          (m: { author: { bot: any } }) => m.author.bot
        ),
        true
      )
      await this.log('Bot::channelClearBotOnly()')
      await this.message.delete()
    }
  }
}

export default Bot
