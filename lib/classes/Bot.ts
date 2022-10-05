import {
  ActionRowBuilder,
  ButtonBuilder,
  Channel,
  TextChannel,
  Message,
  PermissionResolvable,
} from 'discord.js'

import { buttonFactory } from 'lib/utils/factory'
import { BotClass } from '../types/interfaces'

import copy from '../data/copy.json'

class Bot implements BotClass {
  message: Message
  logChannel: TextChannel

  constructor(message: Message, logChannel: TextChannel) {
    this.message = message
    this.logChannel = logChannel
  }

  private isAdmin = async (): Promise<boolean> => {
    if (this.message.member === null) return false
    const evalPerms: boolean = this.message.member.permissions.has(
      'ADMINISTRATOR' as PermissionResolvable
    )
    return evalPerms
  }

  private fetchChannelMessages = async (): Promise<any> => {
    const channelMessages =
      await this.message.channel.messages.channel.messages.fetch({
        limit: 100,
      })
    return channelMessages
  }

  public createRoleButtons = async (param: Channel | undefined) => {
    const channel = param as TextChannel
    const isAdmin = await this.isAdmin()

    if (this.message.content === 'create_get_roles_button' && isAdmin) {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        buttonFactory('Community'),
        buttonFactory('User'),
        buttonFactory('Developer')
      )

      await channel.send({
        content: `${copy.get_roles_message}`,
        components: [row],
      })
    }
  }

  public channelClear = async () => {
    const isAdmin = await this.isAdmin()
    if (this.message.content === 'cls' && isAdmin) {
      const channel = this.message.channel as TextChannel
      const messages = await this.fetchChannelMessages()
      await channel.bulkDelete(messages, true)
      await this.logger('Bot::channelClear()')
      await this.message.delete()
    }
  }

  public channelClearBotOnly = async () => {
    const isAdmin = await this.isAdmin()
    if (this.message.content === 'clsb' && isAdmin) {
      const channel = this.message.channel as TextChannel
      const messages = await this.fetchChannelMessages()
      await channel.bulkDelete(
        messages.filter((m: Message) => m.author.bot),
        true
      )
      await this.logger('Bot::channelClearBotOnly()')
      await this.message.delete()
    }
  }

  public logger = async (method: string) => {
    this.logChannel.send({
      content: `[${method}] (${this.message.channel}) username: ${this.message.author.username}, content: ${this.message.content}`,
    })
  }
}

export default Bot
