const fs = require("node:fs");
require("dotenv").config();
const path = require("node:path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
  Events,
} = require("discord.js");
const token = process.env["token"];
const mongoose = require("mongoose");
const callSchema = new mongoose.model(
  "Call",
  mongoose.Schema({
    channel: { type: String },
    pid: { type: String },
    absoluteDate: { type: Date },
  }),
);

// redirect stdout / stderr
process.__defineGetter__("stdout", function () {
  return fs.createWriteStream(__dirname + "/access.log", { flags: "a" });
});
process.__defineGetter__("stderr", function () {
  return fs.createWriteStream(__dirname + "/error.log", { flags: "a" });
});

//const db = new JsonDB(new Config("channelDb1", true, false, '/'));

connecttodb().catch((err) => console.log(err));

async function connecttodb() {
  await mongoose.connect(
    "mongodb+srv://crazycat:Vaggelis2010@cluster0.uv6dmxw.mongodb.net/?retryWrites=true&w=majority",
  );
  console.log("Connected to mongodb.");
}

const http = require("http");
const host = "0.0.0.0";
const port = 8080;

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Server is running! Current time: " + Date.now());
  console.log("Server is running! Current time: " + Date.now());
};

var sloppa = fs.readFileSync(
  __dirname + "/textart.txt",
  "ascii",
  (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  },
);

const server = http.createServer(requestListener);
server.maxConnections = 99999;
server.listen(port, host, () => {
  console.log(sloppa + "\n--- NEW LOG ---");
  console.log("--- CURRENT TIME: " + Date.now() + " ---");
  console.log(`Server is running on http://${host}:${port}`);
});

const requesttt = (options) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (d) => {
        data += d;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Error code: ${res.statusCode}.`));
        }
      });

      res.on("error", (error) => {
        reject(new Error(error));
      });
    });

    req.end();
  });
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.commands = new Collection();

const loadCommands = () => {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
};

async function repeat() {
  //First loop of function declined.
  requesttt({
    hostname: "0.0.0.0",
    port: 8080,
    path: "/",
    method: "GET",
  }).then((data) => {
    console.log(data);
  });
  setTimeout(repeat, 55000);
}

client.once("ready", async (c) => {
  try {
    require("./deploy-commands.js");
    repeat();
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(`Ready! Logged in as ${c.user.tag}`);

  //client.user.setActivity({
  //  type: ActivityType.Custom,
  //  name: "customtest",
  //  state: "Προστατεύοντας την GameCraft."
  //})

  client.user.setPresence({
    activities: [
      {
        name: "Προστατεύοντας την GameCraft.",
        type: ActivityType.Custom,
        state: "Το μπότ λειτουργεί κανονικά.", //Το μπότ είναι υπο συντήρηση. Μερικές εντολές μπορεί να μην λειτουργούν σωστά. //Το μπότ λειτουργεί κανονικά.
      },
    ],
    status: "online",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const callStart = async (person, channel) => {
  const dateAndTime = new Date(new Date() + 120 * 60 * 1000).toLocaleString(
    "el-GR",
    { hour12: true },
  );
  const absoluteDate = new Date(new Date() + 120 * 60 * 1000);
  console.log(dateAndTime);
  const pid = person.id;

  const skeett = new callSchema({
    channel: channel,
    pid: pid,
    absoluteDate: absoluteDate,
  });
  await skeett.save();
  //await db.push("/" + channel, { pid, absoluteDate });

  const channel13 = await client.channels.fetch("1141341457706405978");
  const embed2 = new EmbedBuilder()
    .setTitle("Νέα Κλήση")
    .setDescription(
      `Ο/Η <@${pid}> Ξεκίνησε μια κλήση στο κανάλι φωνής <#1141337672477065227>.`,
    )
    .setColor("#00b0f4")
    .setFooter({
      text: "Gamecraft Bot",
      iconURL:
        "https://cdn.discordapp.com/attachments/1009002117329072139/1154062260768084048/Untitled.jpg",
    })
    .setTimestamp();

  channel13.send("@everyone \n");
  channel13.send({ embeds: [embed2] });
};

const msToTime = (duration) => {
  let milliseconds = Math.floor((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "" + hours : hours;
  minutes = minutes < 10 ? "" + minutes : minutes;
  seconds = seconds < 10 ? "" + seconds : seconds;

  return `${hours} ώρες, ${minutes} λεπτά και ${seconds} δευτερόλεπτα.`;
};

const callEnd = async (channel) => {
  let yeydasd;

  try {
    yeydasd = await callSchema.findOne({ channel: channel });
    yeydasd = yeydasd["absoluteDate"];
  } catch (error) {
    console.error(error);
    re;
  }

  console.log(
    msToTime(Math.abs(new Date(new Date() + 120 * 60 * 1000) - yeydasd)),
  );

  const channel13 = await client.channels.fetch("1141341457706405978");
  const embed3 = new EmbedBuilder()
    .setTitle("Τέλος Κλήσης")
    .setDescription(
      `Η κλήση στο κανάλι φωνής <#1141337672477065227> έχει τελειώσει. Η κλήση διήρκησε ${msToTime(
        Math.abs(new Date(new Date() + 120 * 60 * 1000) - yeydasd),
      )}`,
    )
    .setFooter({
      text: "Gamecraft Bot",
      iconURL:
        "https://cdn.discordapp.com/attachments/1009002117329072139/1154062260768084048/Untitled.jpg",
    })
    .setTimestamp();

  channel13.send({ embeds: [embed3] });
  await callSchema.deleteOne({ channel: channel });
};

const usersInCall = {};

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState.channel !== null) {
    if (newState.channelId === "1141338719882846319") return;
    if (
      newState.selfVideo ||
      newState.selfDeaf ||
      newState.selfMute ||
      newState.serverDeaf ||
      newState.serverMute
    ) {
      return;
    }

    const members = newState.channel.members.size;

    if (!usersInCall[newState.member.user.id]) {
      console.log(`${newState.member.user.displayName} joined.`);
      console.log(members);

      usersInCall[newState.member.id] = true;

      if (members > 1) return;

      callStart(newState.member, newState.channel.name);
      console.log(`${newState.member.displayName} is in the call.`);
    }
  } else if (oldState.channel) {
    if (oldState.channelId === "1141338719882846319") return;

    const members = oldState.channel.members.size;

    console.log(`${oldState.member.displayName} left`);
    console.log(members);

    if (usersInCall[oldState.member.id]) {
      delete usersInCall[oldState.member.id];
    }

    if (oldState.channel.members.size === 0) {
      console.log("No users are in the call.");
      callEnd(oldState.channel.name);
    }
  } else {
    console.log("Neither of the two actions occurred");
  }
});

client.on(Events.ShardError, (errorr) => {
  client.users.get("886303788556759110").send(errorr);
});

client.login(token);
loadCommands();
