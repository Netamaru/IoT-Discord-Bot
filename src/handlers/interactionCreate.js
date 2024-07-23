const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    let logs = `**${
      interaction.user.tag
    }** in <#867719333831376896> triggered error with \`/${
      interaction.commandName || "an interaction button"
    }\` command`;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    }
  });
};
