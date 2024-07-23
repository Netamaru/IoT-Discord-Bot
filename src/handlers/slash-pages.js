const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  embedPages: async (interaction, embeds) => {
    const pages = {};
    const getRow = (id) => {
      //Create the action row with buttons
      const row = new ActionRowBuilder();

      row.addComponents(
        new ButtonBuilder()
          .setLabel("◀")
          .setCustomId("prev_embed")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(pages[id] === 0)
      );

      row.addComponents(
        new ButtonBuilder()
          .setLabel("▶")
          .setCustomId("next_embed")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(pages[id] === embeds.length - 1)
      );

      // -------------- Any other custom Button (if needed) --------------
      //   row.addComponents(
      //     new ButtonBuilder()
      //       .setLabel('Any label you want')
      //       .setCustomId('custom_id')
      //       .setStyle(ButtonStyle.AnyStyleYouWant)
      //   );
      // -------------- Any other custom Button (if needed) --------------
      return row;
    };

    const id = interaction.user.id;
    pages[id] = pages[id] || 0;
    let Pagemax = embeds.length;

    const embed = embeds[pages[id]];

    await embeds[pages[id]].setFooter({
      text: `Page ${pages[id] + 1} of ${Pagemax}`,
    });

    const replyEmbed = await interaction.editReply({
      embeds: [embed],
      components: [getRow(id)],
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const time = 1000 * 60 * 5;

    const collector = await replyEmbed.createMessageComponentCollector({
      filter,
      time,
    });

    collector.on("collect", async (b) => {
      if (!b) return;
      if (b.customId !== "prev_embed" && b.customId !== "next_embed") return;

      b.deferUpdate();

      if (b.customId === "prev_embed" && pages[id] > 0) {
        --pages[id];
      } else if (b.customId === "next_embed" && pages[id] < embeds.length - 1) {
        ++pages[id];
      }

      await embeds[pages[id]].setFooter({
        text: `Page ${pages[id] + 1} of ${Pagemax}`,
      });

      await interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id)],
        fetchReply: true,
      });
    });

    // -------------- Not needed --------------
    collector.on("end", async (reason) => {
      return await interaction.editReply({
        components: [],
      });
    });
    // -------------- Not needed --------------
  },
};
