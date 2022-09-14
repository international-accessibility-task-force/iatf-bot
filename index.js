require('dotenv').config()
const keepAlive = require('./server.js')
// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js')
const token = process.env.TOKEN

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
})

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!')
})

client.on('messageCreate', async (msg) => {
  const guild = msg.guild
  const channel = msg.channel
  const debug_log_channel = await client.channels.cache.get('1018843354705956956')

  // clear channel (only reserved role)
  if (msg.content === 'cls' && msg.member.roles.cache.some((role) => role.name === 'reserved')) {
    async function clearChat(msg, numb) {
      const channel = msg.channel
      const messageManager = channel.messages
      const messages = await messageManager.channel.messages.fetch({
        limit: numb,
      })
      channel.bulkDelete(messages, true)
    }

    clearChat(msg, 100)
    return console.log('clear channel (only reserved role)')
  }

  // #server-introductions template
  if (msg.channel.name === 'server-introductions' && !msg.content.includes(`[${msg.author.username}]`)) {
    debug_log_channel.send({ content: `[DELETED] (#server-introductions) username: ${msg.author.username}, content: ${msg.content}` })
    await msg.delete()
    return console.log('#server-introductions template')
  }

  // #kindly-ping channel template
  if (!msg.content.includes('@') && channel.name === 'kindly-ping') {
    debug_log_channel.send({ content: `[DELETED] (#kindly-ping) username: ${msg.author.username}, content: ${msg.content}` })
    await msg.delete()
    return console.log('#kindly-ping channel template')
  }

  // #request-project create project logic
  let createProject = false
  if (
    msg.content.includes('create project') &&
    channel.name === 'request-project' &&
    msg.member.roles.cache.some((role) => role.name === 'Developer')
  ) {
    let newChannelName = ''
    let projectMembers = []

    projectMembers = await msg.content.substring(msg.content.indexOf('[') + 1, msg.content.indexOf(']'))
    projectMembersArr = projectMembers.split(',').map((e) => e.trim())
    projectMembersArr.push('iatf-bot')
    //console.log(msg.content)
    //console.log('PMA', projectMembersArr)

    async function getCurrentWorkingGroups() {
      let workingGroupsNames = []
      const channels = await guild.channels.fetch() //1017804643121766410
      for (const c of channels.values()) {
        if (c.name.includes('working-group-')) {
          workingGroupsNames.push(c.name)
        }
      }

      return workingGroupsNames
    }
    const currGroups = await getCurrentWorkingGroups()

    async function createNewChannelName(currGroups) {
      if (currGroups.length === 0) return (newChannelName = 'working-group-0')

      const lastCurrGroup = currGroups[currGroups.length - 1]
      const regex = /\d+/g
      const string = lastCurrGroup
      const lastGroupNumber = parseInt(string.match(regex))
      console.log(lastGroupNumber)
      console.log(1)
      const newGroupNumber = lastGroupNumber + 1
      newChannelName = 'working-group-' + newGroupNumber
    }
    createNewChannelName(currGroups)

    async function createChannel() {
      const newChannel = await guild.channels.create({ name: newChannelName })
      await newChannel.setParent('1017804643121766410')
      await newChannel.send({ content: `Project members that can use this channel are: ${projectMembersArr.join(', ')}` })
      //console.log(newChannel.id)
    }
    createChannel()
    return console.log('#request-project create project logic')
  } // is user
  else if (
    msg.content.includes('create project') &&
    channel.name === 'request-project' &&
    msg.member.roles.cache.some((role) => role.name === 'User')
  ) {
    if (!msg.content.includes(`[request-project]`)) {
      return console.log('#request-project user created!')
    } else {
      debug_log_channel.send({ content: `[DELETED] (#request-project) username: ${msg.author.username}, content: ${msg.content}` })
      await msg.delete()
      return console.log('#request-project user, not a user!')
    }
  } // is not user or developer
  else if (
    msg.content.includes('create project') &&
    channel.name === 'request-project' &&
    !msg.member.roles.cache.some((role) => role.name === 'User')
  ) {
    debug_log_channel.send({ content: `[DELETED] (#request-project) username: ${msg.author.username}, content: ${msg.content}` })
    await msg.delete()
    return console.log('#request-project create project logic, not a developer or user!')
  }

  // if no introduction has been written, delete the message
  if (channel.name !== 'server-introductions' && !msg.author.bot) {
    const introductionsChannel = client.channels.cache.get('1017808594055462942')

    async function getAllMessages() {
      const allMessages = await introductionsChannel.messages.fetch()
      let verified = []
      for (const m of allMessages.values()) {
        verified.push(m.author.username)
      }
      console.log(verified)
      if (!verified.includes(msg.author.username)) {
        //console.log(msg.content)
        debug_log_channel.send({ content: `[DELETED] (#server-introductions MISSING) username: ${msg.author.username}, content: ${msg.content}` })
        await msg.delete()
        return console.log('if no introduction has been written, delete the message')
      }
    }
    await getAllMessages()
    return console.log('channel.name !==server-introductions && !msg.author.bot')
  }
  /*   
  if (channel.name !== 'server-introductions' && !msg.author.bot && createProject !== true) {
      console.log('createProject value', createProject)
      console.log('content', msg.content, 'author', msg.author.username)
      const introductionsChannel = client.channels.cache.get('1017808594055462942')

      async function getAllMessages() {
        const allMessages = await introductionsChannel.messages.fetch()
        let verified = []
        for (const m of allMessages.values()) {
          verified.push(m.author.username)
        }
        console.log(verified)
        if (!verified.includes(msg.author.username)) {
          console.log(msg.content)
          await msg.delete()
        }
      }
      await getAllMessages()
      return console.log('if no introduction has been written, delete the message')
  } 
  */

  // only working group members can talk in its own channel
  if (msg.channel.parent.name === '/IATF/private') {
    async function getAllMessagesOnWorkgroup() {
      const messsages = await msg.channel.messages.fetch()
      let lastMessage = ''
      for (const c of messsages.values()) {
        lastMessage = c.content
      }
      console.log(lastMessage)
      if (!lastMessage.includes(msg.author.username)) {
        debug_log_channel.send({ content: `[DELETED] (#working-groups) username: ${msg.author.username}, content: ${msg.content}` })
        await msg.delete()
      }
    }
    await getAllMessagesOnWorkgroup()
    return console.log('only working group members can talk in its own channel')
  }
})

/* 
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction

  if (commandName === 'ping') {
    await interaction.reply('Pong!')
  } else if (commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
  } else if (commandName === 'user') {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`)
  }
}) 
*/
keepAlive()
// Login to Discord with your client's token
client.login(token)
