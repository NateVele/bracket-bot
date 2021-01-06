const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  await message.channel.send("pong!").catch(console.error);
};
