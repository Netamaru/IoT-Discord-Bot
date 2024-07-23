const wait = require("node:timers/promises").setTimeout;
const fs = require("node:fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const bulbData = require("../../files/bulb.json");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.customId) return;
    if (interaction.customId !== "bright_reset") return;

    const data = bulbData;

    const dgram = require("dgram");
    const net = require("net");

    const udpPort = 1982;
    const multicastAddress = "10.255.255.255";
    const telnetPort = 55443;
    const ip = "10.0.0.111";

    const sendUdpDiscovery = (message) => {
      return new Promise((resolve, reject) => {
        const client = dgram.createSocket("udp4");

        client.on("error", (error) => {
          client.close();
          reject(error);
        });

        client.on("message", (response, info) => {
          const data = { ip: info.address, res: response.toString() };
          client.close();
          resolve(data);
        });

        client.send(message, udpPort, multicastAddress, (error) => {
          if (error) {
            client.close();
            reject(error);
          }
        });
      });
    };

    const sendTelnetCommand = (ipAddress, command) => {
      return new Promise((resolve, reject) => {
        const telnet = new net.Socket();

        telnet.connect(telnetPort, ipAddress, () => {
          telnet.write(command);
        });

        telnet.on("data", (data) => {
          telnet.destroy();
          resolve(data.toString());
        });

        telnet.on("error", (error) => {
          console.error("Error:", error);
          telnet.destroy();
          reject(error);
        });

        telnet.on("close", () => {});
      });
    };

    let val = 100;

    const udpMessage = Buffer.from(
      'M-SEARCH * HTTP/1.1\r\nHOST: 10.255.255.255:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb'
    );

    try {
      // const response = await sendUdpDiscovery(udpMessage);
      const telnetCommand = `{"id": 0, "method": "set_bright", "params": [${val}, "smooth", 500]}\r\n`;
      await sendTelnetCommand(ip, telnetCommand);

      interaction.deferUpdate();
      data.brightness = 100;

      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Light Control Panel")
        .addFields(
          {
            name: "Bulb status",
            value: `\`\`\`\nPower     : ${data.power.toUpperCase()}\nBrightness: ${
              data.brightness
            }\`\`\``,
            inline: false,
          },
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

      const col1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("bulb_off")
          .setEmoji("1120304449022341140")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("bright_min")
          .setEmoji("1120301339981926410")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("bulb_info")
          .setEmoji("1120301809714610177")
          .setStyle(ButtonStyle.Secondary)
      );
      const col2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("bulb_on")
          .setEmoji("1120301350308290662")
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

      interaction.message.edit({
        embeds: [embed],
        components: [col1, col2],
      });

      fs.writeFileSync(
        __dirname + "../../../files/bulb.json",
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
