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
    if (!interaction.customId.startsWith("color")) return;

    await interaction.deferReply();

    const dgram = require("dgram");
    const net = require("net");

    const udpPort = 1982;
    const multicastAddress = "10.255.255.255";
    const telnetPort = 55443;

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

    let val;
    if (interaction.values[0] === "color_white") {
      val = 6500;
    } else if (interaction.values[0] === "color_night") {
      val = 3500;
    } else {
      return;
    }

    const udpMessage = Buffer.from(
      'M-SEARCH * HTTP/1.1\r\nHOST: 10.255.255.255:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb'
    );

    try {
      const response = await sendUdpDiscovery(udpMessage);
      let bulbStats = response.res.split("+").join("");
      let bulbData = {
        brightness: Number(bulbStats.match(/bright: (\d+)/)[1]),
        rgb: Number(bulbStats.match(/rgb: (\d+)/)[1]),
        hue: Number(bulbStats.match(/hue: (\d+)/)[1]),
        sat: Number(bulbStats.match(/sat: (\d+)/)[1]),
      };

      const telnetCommand = `{"id":1,"method":"set_ct_abx","params":[${val}, "smooth", 500]}\r\n`;
      const telnetres = await sendTelnetCommand(response.ip, telnetCommand);

      await interaction.editReply({
        content: `\`\`\`json\n${telnetres}\`\`\``,
      });
      await wait(1000);
      interaction.deleteReply();
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
