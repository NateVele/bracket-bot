const Discord = require("discord.js");

module.exports = (client, message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content.indexOf(client.config.prefix) !== 0) {
    return;
  }

  const args = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  if (!cmd) {
    return;
  }

  // try {
  //   if (command == "generate") {
  //     throw new Error(
  //       "Cannot generate bracket.  Bracket already being created."
  //     );
  //   }
  // } catch (err) {
  //   console.log(err);
  //   message.channel.send(err.message);
  // }

  cmd.run(client, message, args);
};
