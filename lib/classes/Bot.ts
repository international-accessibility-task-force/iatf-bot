export class Bot {
  constructor(
    message,
    messageGuild,
    messageChannel,
    messageAuthor,
    messageAuthorRoles,
    messageContent,
    channelMessages,
    client,
    logsChannel
  ) {
    this.message = message
    this.messageGuild = messageGuild
    this.messageChannel = messageChannel
    this.messageAuthor = messageAuthor
    this.messageAuthorRoles = messageAuthorRoles
    this.messageContent = messageContent
    this.channelMessages = channelMessages
    this.client = client
    this.logsChannel = logsChannel
  }

  log = async (method) => {
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
        this.channelMessages.filter((m) => m.author.bot),
        true
      )
      await this.log('Bot::channelClearBotOnly()')
      await this.message.delete()
    }
  }

  awaitingVerification = async () => {
    if (this.messageAuthor.bot) return
    if (
      !this.messageAuthorRoles.includes('verified') &&
      this.messageChannel.name === 'server-introductions'
    ) {
      this.messageChannel.send({
        content: `Hi ${this.messageAuthor.username}! Welcome to this warm, friendly, and accessible community! We are glad you are here. For now, you only have to wait until the admin team reviews your introduction and accepts you as a verified member of the community. Until then, you can read the channels but can not write on them. Many thanks and all the best, The Admin Team!`,
      })
    }
  }
}
