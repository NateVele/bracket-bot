const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  let member = message.mentions.members.first();
  await message.channel.send(`fuck ${member}`);
};
