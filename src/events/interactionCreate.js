var clc = require("cli-color");

module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    let note = clc.blackBright.bgWhiteBright;
    let commandName = clc.whiteBright.bgBlackBright;
    let channelName = clc.black.bgCyan;

    const cmdName = interaction.commandName || "owo";
    console.log(
      `╰➤ ${note(` ${interaction.user.tag} in `)}${channelName(
        ` #${interaction.channel.name} `
      )}${note(" triggered ")}${commandName(
        ` ${
          cmdName == "owo"
            ? "an Interaction "
            : `/${cmdName} ${note(" command ")}`
        }`
      )}`
    );
  },
};
