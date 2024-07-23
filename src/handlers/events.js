const { eventsDir } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");
var clc = require("cli-color");

module.exports = async (client) => {
  let note = clc.black.bgGreenBright;
  let note1 = clc.black.bgWhiteBright;

  const eventsPath = eventsDir.map((e) => path.join(__dirname, e));
  eventsPath.forEach((element) => {
    const eventFiles = fs
      .readdirSync(element)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(element, file);
      const event = require(filePath);
      try {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
  console.log(`🡆${note1(" Events ")}` + note(" loaded "));
};
