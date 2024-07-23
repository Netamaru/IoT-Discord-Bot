var clc = require("cli-color");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    msg = clc.black.bgMagentaBright;
    note = clc.black.bgWhiteBright;
    console.log(
      `🡆${note(" Ready! Logged in as ")}` + msg(` ${client.user.tag} `)
    );
  },
};
