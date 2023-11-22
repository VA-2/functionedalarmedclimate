const { SlashCommandBuilder } = require('discord.js');
var fs = require('fs'),
request = require('request');

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnitemap')
        .setDescription('Δίχνει το τρεχών map στο fortnite.'),
    async execute(interaction) {
        await download("https://fortnite-api.com/images/map_en.png", "./tempmap.png")
        interaction.reply({files: [{ attachment: "./tempmap.png" }]})
        await setTimeout(5000)
        fs.unlink("./tempmap.png")
    },
};