const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId, guildId, token } = require("../../config.json");
const fs = require("node:fs");
const path = require("node:path");
const { commandsDir } = require("../../config.json");

const commands = [];
const commandsPath = commandsDir.map((e) => path.join(__dirname, "../", e));

commandsPath.forEach((element) => {
  const commandFiles = fs
    .readdirSync(element)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(element, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
});

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
