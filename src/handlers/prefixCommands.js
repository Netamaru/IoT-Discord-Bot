const { globalPrefix, prefixCommandDir } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");
var clc = require("cli-color");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, prefixes) => {
  let note1 = clc.black.bgGreenBright;
  let note1_2 = clc.black.bgWhiteBright;
  let note2 = clc.blackBright.bgWhiteBright;
  let commandName = clc.whiteBright.bgBlackBright;
  let channelName = clc.black.bgCyan;

  const commandsPath = prefixCommandDir.map((e) => path.join(__dirname, e));
  const commandFiles = [];
  commandsPath.forEach((element) => {
    fs.readdir(element, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      files.forEach(async function (file) {
        if (file.includes(".js")) {
          commandFiles.push({ name: file.replace(".js", ""), path: element });
        }
      });
    });
  });

  console.log(`🡆${note1_2(" Prefix commands ")}` + note1(" loaded "));

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content === `<@${client.user.id}>`) {
      return message.channel.send(
        `Prefix is \`${
          (await prefixes.get(message.guild.id)) || globalPrefix
        }\``
      );
    }

    let args;
    // handle messages in a guild
    if (message.guild) {
      let prefix;

      if (message.content.startsWith(globalPrefix)) {
        prefix = globalPrefix;
      } else {
        // check the guild-level prefix
        const guildPrefix = await prefixes.get(message.guild.id);
        if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
      }

      // if we found a prefix, setup args; otherwise, this isn't a command
      if (!prefix) return;
      args = message.content.slice(prefix.length).trim().split(/\s+/);
    } else {
      // handle DMs
      const slice = message.content.startsWith(globalPrefix)
        ? globalPrefix.length
        : 0;
      args = message.content.slice(slice).split(/\s+/);
    }

    // get the first space-delimited argument after the prefix as the command
    const command = args.shift().toLowerCase();
    const _channel = client.channels.cache.get(message.channelId);

    commandFiles.map(async (data) => {
      if (data.name === command) {
        console.log(
          `╰➤ ${note2(
            ` ${message.author.username}#${message.author.discriminator} in `
          )}` +
            `${channelName(` #${_channel.name || "Direct Message"} `)}` +
            `${note2(" triggered ")}` +
            `${commandName(` ${globalPrefix + command} `)}` +
            `${note2(" command ")}`
        );

        let commandFile = require(`${data.path}/${data.name}.js`);
        let logs;
        let msgUrl = `https://discord.com/channels/${message?.guildId}/${message?.channelId}/${message?.id}`;
        try {
          logs = `**${message.author.username}#${
            message.author.discriminator
          }** in [#${
            _channel.name || "Direct Message"
          }](${msgUrl}) triggered error with \`${
            globalPrefix + command
          }\` command`;
          await commandFile.execute(
            message,
            args,
            prefixes,
            command,
            globalPrefix,
            client
          );
        } catch (error) {
          console.error(error);
          const errorEmbed = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle("###### ERROR ALERT ######")
            .setDescription(`${logs}\`\`\`JS\n${error.stack}\`\`\``);
          await message.reply({
            content:
              "There was an error while executing this command and has been reported to Netamaru",
          });
          client.channels.cache.get("1056610575519600711").send({
            embeds: [errorEmbed],
            content: `<@188293493221752832>`,
          });
        }
      }
      return;
    });
  });
};
