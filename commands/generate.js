const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  try {
    const bracketowner = message.author.id;
    const channel = message.channel;
    let arr = [];
    const embeddedMessage = new Discord.MessageEmbed();
    embeddedMessage.setTitle("Registration is now open.");
    embeddedMessage.setDescription(
      `Please register by saying your tag in ${message.channel}`
    );
    let stopped = false;
    let exit = false;
    const filter = (ctx) =>
      ctx.content.startsWith("add") ||
      ctx.content.startsWith("close") ||
      ctx.content.startsWith("members") ||
      ctx.content.startsWith("remove");
    const collector = message.channel.createMessageCollector(filter);
    message.channel.send(embeddedMessage);

    for await (const ctx of collector) {
      let myargs = ctx.content.trim().split(/ +/);
      let msg = "";

      if (
        !myargs.includes("close") ||
        !myargs.includes("members") ||
        !myargs.includes("remove")
      ) {
        msg = ctx.content.substring(3);
        console.log(msg);
      }

      if (myargs.includes("remove") && ctx.author.id == bracketowner) {
        msg = ctx.content.substring(6);
        let index = arr.indexOf(msg);
        if (index < 0) {
          let not = new Discord.MessageEmbed();
          not.setTitle("This user is not currently entered.");
          channel.send(not);
          continue;
        } else {
          arr.splice(index, 1);
          let not = new Discord.MessageEmbed();
          not.setTitle(`${msg} has been removed from the bracket.`);
          channel.send(not);
          continue;
        }
      } else {
        let not = new Discord.MessageEmbed();
        not.setTitle(
          "Please ask the bracket owner or a mod to remove you from the bracket."
        );
        channel.send(not);
      }

      if (myargs.includes("close") && ctx.author.id === bracketowner) {
        collector.stop();
        stopped = true;
        exit = true;
        let not = new Discord.MessageEmbed();
        not.setTitle("Bracket registration is now closed.");
        channel.send(not);
        if (arr.length != 0) {
          const entrants = new Discord.MessageEmbed().setTitle(
            "Final Bracket Entrants"
          );
          entrants.addField(`${arr.length} entrants`, arr);
          channel.send(entrants);
        }
        break;
      } else if (arr.includes(msg)) {
        let not = new Discord.MessageEmbed();
        not.setTitle("Error");
        not.setDescription(
          "This tag is already registered. Please choose a different tag."
        );
        channel.send(not);
        continue;
      } else if (myargs.includes("close") && ctx.author.id !== bracketowner) {
        continue;
      } else if (myargs.includes("members")) {
        if (arr.length != 0) {
          const entrants = new Discord.MessageEmbed().setTitle(
            "Current Bracket Entrants"
          );
          entrants.addField(`${arr.length} entrants`, arr);
          channel.send(entrants);
          continue;
        }
        const entrants = new Discord.MessageEmbed().setTitle(
          "No Current Entrants"
        );
        channel.send(entrants);
      } else {
        arr.push(msg);
        let not = new Discord.MessageEmbed();
        not.setTitle(`${msg} has been added to the bracket.`);
        channel.send(not);
      }
    }
  } catch (err) {
    console.log(err);
    message.channel.send("Error");
  }
};
