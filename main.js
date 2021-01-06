const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
require('dotenv').config();

client.config = config;

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split('.')[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

// bot.on("ready" , () => {
//     console.log("ready");
// });

// bot.on("error", (e) => console.error(e));
// bot.on("warn", (e) => console.warn(e));
// bot.on("debug", (e) => console.info(e));

// bot.on("message", (message) => {
//     if (message.author.bot) {
//         return;
//     }
//     if (message.content.indexOf(config.prefix) !== 0) {
//         return;
//     }

//     const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
//     const command = args.shift().toLowerCase();

//     switch(command) {
//         case "ping" :
//             message.channel.send("pong!");
//             break;
//         case "fuck" :
//             let member = message.mentions.members.first();
//             message.channel.send(`fuck ${member}`);
//             break;
//         default :
//             break;
//     }
// });

client.login(process.env.BOT_TOKEN);
