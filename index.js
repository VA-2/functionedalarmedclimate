const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { JsonDB, Config } = require('node-json-db');
const http = require("http");

const db = new JsonDB(new Config("channelDb1", true, false, '/'));
const host = '0.0.0.0';
const port = 8080;

const requestListener = function(req, res) {
  res.writeHead(200);
  res.end("My first server!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

const loadCommands = () => {
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
};

client.once(Events.ClientReady, async (c) => {
  try {
    require('./deploy-commands.js');
  } catch (error) {
    console.log(error);
    return;
  }

  console.log(`Ready! Logged in as ${c.user.tag}`);
  console.log(eval(2 + 2));
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

const callStart = async (person, channel) => {
  const dateandtime = new Date().toLocaleString("en-BZ", { hour12: true }).replace('pm', 'ΜΜ').replace('am', 'ΠΜ');
  const absolutedat = new Date();
  const pid = person.id;

  await db.push("/" + channel, { pid, dateandtime, absolutedat });

  const channel13 = await client.channels.fetch("1141341457706405978");
  const embed2 = new EmbedBuilder()
    .setTitle("Νέα Κλήση")
    .setDescription(`Ο/Η <@${pid}> Ξεκίνησε μια κλήση στο κανάλι φωνής <#1141337672477065227>, στις ${dateandtime}.`)
    .setColor("#00b0f4")
    .setFooter({
      text: "Gamecraft Bot",
      iconURL: "https://cdn.discordapp.com/attachments/1009002117329072139/1154062260768084048/Untitled.jpg",
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

  hours = (hours < 10) ? "" + hours : hours;
  minutes = (minutes < 10) ? "" + minutes : minutes;
  seconds = (seconds < 10) ? "" + seconds : seconds;

  return `${hours} ώρες, ${minutes} λεπτά και ${seconds} δευτερόλεπτα.`;
};

const callEnd = async (channel) => {
  let yeydasd;

  try {
    yeydasd = await db.getData("/" + channel);
    yeydasd = yeydasd["absolutedat"];
  } catch (error) {
    console.error(error);
  }

  const channel13 = await client.channels.fetch("1141341457706405978");
  const embed3 = new EmbedBuilder()
    .setTitle("Τέλος Κλήσης")
    .setDescription(`Η κλήση στο κανάλι φωνής <#1141337672477065227> έχει τελειώσει. Η κλήση διήρκησε ${msToTime(Math.abs(new Date() - yeydasd))}`)
    .setFooter({
      text: "Gamecraft Bot",
      iconURL: "https://cdn.discordapp.com/attachments/1009002117329072139/1154062260768084048/Untitled.jpg",
    })
    .setTimestamp();

  channel13.send({ embeds: [embed3] });
  await db.delete("/" + channel);
};

const usersInCall = {};

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.channel !== null) {
    if (newState.channelId === "1141338719882846319") return;
    if (newState.selfVideo || newState.selfDeaf || newState.selfMute || newState.serverDeaf || newState.serverMute) {
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
      console.log('No users are in the call.');
      callEnd(oldState.channel.name);
    }
  } else {
    console.log('Neither of the two actions occurred');
  }
});

client.login(token);
loadCommands();