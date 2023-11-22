const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require("axios")
var fs = require('fs')

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fortnitemap')
    .setDescription('Δίχνει το τρεχών map στο fortnite.'),
  async execute(interaction) {
    const attachment = new AttachmentBuilder("./map_en.png");
    interaction.reply({ files: [attachment] });
  },
};