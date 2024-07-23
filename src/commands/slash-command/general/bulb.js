const { SlashCommandBuilder } = require("discord.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bulb")
    .setDescription("bulb")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("Light Control Panel")
      .addFields(
        {
          name: "Switch⠀⠀⠀⠀",
          value:
            "**<:light_off:1120304449022341140> `OFF`**\n**<:light_on:1120301350308290662> `ON`**",
          inline: true,
        },
        {
          name: "Brightness⠀",
          value:
            "**<:minus:1120301339981926410> `-10%`**\n**<:plus:1120301342095835146> `+10%`**\n**<:reset:1120303326098112593> `Reset`**",
          inline: true,
        },
        {
          name: "\u200B",
          value: "**<:info:1120301809714610177> `Device info`**",
          inline: true,
        }
      );

    const toggle = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bulb_off")
        .setEmoji("1120304449022341140")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bulb_on")
        .setEmoji("1120301350308290662")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bulb_info")
        .setEmoji("1120301809714610177")
        .setStyle(ButtonStyle.Secondary)
    );
    const brightness = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bright_min")
        .setEmoji("1120301339981926410")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bright_plus")
        .setEmoji("1120301342095835146")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bright_reset")
        .setEmoji("1120303326098112593")
        .setStyle(ButtonStyle.Secondary)
    );
    await interaction.reply({
      embeds: [embed],
      components: [toggle, brightness],
    });
  },
};
