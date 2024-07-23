const { Client, Collection, IntentsBitField, Partials } = require("discord.js");
const { token, keyvDB, GPTAPI } = require("./config.json");
const Keyv = require("keyv");

//discord intents
const myIntents = new IntentsBitField();
myIntents.add(
  IntentsBitField.Flags.GuildPresences,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages,
  IntentsBitField.Flags.Guilds
);

//handles prefix to database
const prefixes = new Keyv(keyvDB);
prefixes.on("error", (err) => console.error("Keyv connection error:", err));

//client intent to disable mention on replied message
const client = new Client({
  intents: myIntents,
  partials: [Partials.Channel, Partials.Message],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

//disable maxListeners warning
client.setMaxListeners(0);
//commands handling
client.commands = new Collection();
//chatGPT client

//client login
client.login(token);

//import modules
// require("./modules/twitchNotifier")(client);
// require("./modules/youtubeNotifier")(client);
// require("./modules/twitchChatNotification")(client);
// require("./modules/hbdrole")(client);
// require("./modules/osuauthorized")(client);
// require("./modules/reminder")(client);
// require("./modules/checkApi")(client);

//import handlers
require("./handlers/events")(client);
// require("./handlers/guildMember")(client);
require("./handlers/slashCommands")(client);
require("./handlers/interactionCreate")(client);
// require("./handlers/prefixCommands")(client, prefixes, Keyv);
require("./handlers/slash-pages");
