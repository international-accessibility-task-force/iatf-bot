const { ButtonBuilder, ButtonStyle } = require('discord.js')

export function buttonFactory(btnType: string) {
  const button = new ButtonBuilder()
  let style

  if (btnType === 'Community') style = ButtonStyle.Success
  else if (btnType === 'User') style = ButtonStyle.Primary
  else style = ButtonStyle.Secondary

  button.setCustomId(btnType).setLabel(btnType).setStyle(style)

  return button
}
