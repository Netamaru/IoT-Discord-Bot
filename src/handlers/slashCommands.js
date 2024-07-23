const { commandsDir } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");
var clc = require("cli-color");

module.exports = async (client) => {
  let note = clc.black.bgGreenBright;
  let note1 = clc.black.bgWhiteBright;

  const commandsPath = commandsDir.map((e) => path.join(__dirname, e));
  commandsPath.forEach((element) => {
    const commandFiles = fs
      .readdirSync(element)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(element, file);
      const command = require(filePath);
      client.commands.set(command.data.name, command);
    }
  });
  console.log(`🡆${note1(" Slash commands ")}` + note(" loaded "));
};
