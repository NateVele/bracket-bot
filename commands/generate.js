const Discord = require("discord.js");

class Player {
  constructor(name, seed) {
    this.name = name;
    this.seed = seed;
  }
}

exports.run = async (client, message, args) => {
  try {
    const bracketowner = message.author.id;
    const channel = message.channel;
    let arr = [];
    const embeddedMessage = new Discord.MessageEmbed();
    embeddedMessage.setTitle("Registration is now open.");
    embeddedMessage.setDescription(
      `Please register by saying "add {your tag}" in ${message.channel}`
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
      // adding, removing, checking members, and closing bracket
      let myargs = ctx.content.trim().split(/ +/);
      let msg = "";

      if (
        !myargs.includes("close") ||
        !myargs.includes("members") ||
        !myargs.includes("remove")
      ) {
        msg = ctx.content.substring(4);
        console.log(msg);
      }

      if (myargs.includes("remove") && ctx.author.id == bracketowner) {
        //removing
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
      } else if (myargs.includes("remove") && ctx.author.id != bracketowner) {
        let not = new Discord.MessageEmbed();
        not.setTitle(
          "Please ask the bracket owner or a mod to remove you from the bracket."
        );
        channel.send(not);
      }

      if (myargs.includes("close") && ctx.author.id === bracketowner) {
        //closing
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
        //if bracket already has that tag
        let not = new Discord.MessageEmbed();
        not.setTitle("Error");
        not.setDescription(
          "This tag is already registered. Please choose a different tag."
        );
        channel.send(not);
        continue;
      } else if (myargs.includes("close") && ctx.author.id !== bracketowner) {
        //if somemone not modded tries to close the bracket
        const not = new Discord.MessageEmbed().setTitle(
          "You must be the bracket owner or an admin to close the bracket."
        );
        channel.send(not);
        continue;
      } else if (myargs.includes("members")) {
        //check current amount of members in bracket
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
        //add someone to the bracket
        arr.push(msg);
        let not = new Discord.MessageEmbed();
        not.setTitle(`${msg} has been added to the bracket.`);
        channel.send(not);
      }
    }
    let myembed = new Discord.MessageEmbed()
      .setTitle("Seeding")
      .setDescription(
        "Reply 'yes' to manually seed or 'no' to have random seeding."
      );
    let filter2 = (ctx) =>
      ctx.content.startsWith("yes") || ctx.content.startsWith("no");
    const collector2 = channel.createMessageCollector(filter2);
    channel.send(myembed);
    let players = [];
    for await (const ctx of collector2) {
      if (ctx.content.startsWith("yes") && ctx.author.id == bracketowner) {
        collector2.stop();
        let thisembed = new Discord.MessageEmbed()
          .setTitle("Manual Seeding")
          .setDescription(
            "Please seed by saying the name and number in this order: 'Name:seed'"
          );
        let entrants = new Discord.MessageEmbed().setTitle(
          "Unseeded Bracket Entrants"
        );
        entrants.addField(`${arr.length} entrants`, arr);
        channel.send(thisembed);
        channel.send(entrants);

        filter2 = (ctx) => ctx.content.includes(":");
        const collector3 = channel.createMessageCollector(filter2);
        const len = arr.length;

        for await (const ctx of collector3) {
          let str = "";
          let num = 0;
          for (let i = 0; i < ctx.content.length; i++) {
            if (ctx.content[i] == ":") {
              str = ctx.content.substring(i, 0);
              num = ctx.content.substring(i + 1);
              break;
            }
          }
          console.log(num);
          if (num > len || num < 1 || isNaN(num)) {
            let not = new Discord.MessageEmbed().setTitle(
              "Please enter a proper seed."
            );
            channel.send(not);
            continue;
          }
          if (players.length > 0) {
            let mybool = false;
            console.log(mybool);
            for (let i = 0; i < players.length; i++) {
              if (num == players[i].seed) {
                let not = new Discord.MessageEmbed().setTitle(
                  "This seed is already being used."
                );
                channel.send(not);
                mybool = true;
                break;
              } else {
                mybool = false;
              }
            }

            if (mybool == true) {
              console.log("here");
              continue;
            }
          }

          let index = arr.indexOf(str);
          arr.splice(index, 1);
          let entrant = new Player(str, num);
          // console.log(`here ${entrant.name}`);
          // console.log(entrant.name);
          players.push(entrant);
          let not = new Discord.MessageEmbed().setTitle(
            `${str} has been added to the bracket at seed ${num}`
          );
          channel.send(not);
          if (arr.length > 0) {
            let entrants = new Discord.MessageEmbed().setTitle(
              "Unseeded Bracket Entrants"
            );
            entrants.addField(`${arr.length} entrants`, arr);
            channel.send(entrants);
          } else if (arr.length == 0) {
            break;
          }
        }
        break;
      }
      if (ctx.content.startsWith("no") && ctx.author.id == bracketowner) {
        collector2.stop();
        let thisembed = new Discord.MessageEmbed()
          .setTitle("Random Seeding")
          .setDescription("I will now randomize the seeding.");
        channel.send(thisembed);
        break;
      }
    }
    let finalbracketseeds = [];
    for (let i = 0; i < players.length; i++) {
      let index = 0;
      for (let j = 1; j < players.length + 1; j++) {
        if (j == players[j - 1].seed) {
          index = j;
          break;
        }
      }
      finalbracketseeds.push(players[index]);
    }
    channel.send("```" + "Final Seeding" + "```");
    let mystr = "";
    finalbracketseeds.forEach((element) => {
      mystr = mystr + "```" + `${element.seed}. ${element.name}\n` + "```";
    });
    channel.send(mystr);
  } catch (err) {
    console.log(err);
    message.channel.send("```" + "Unexpected Error" + "```");
  }
};
