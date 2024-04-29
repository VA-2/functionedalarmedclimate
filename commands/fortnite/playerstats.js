const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require("axios")

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fortnitestats')
    .setDescription('Δίχνει μερικά στατιστικά ενός account.')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Το όνομα του account.')
        .setRequired(true)),
  async execute(interaction) {
    let dumbyyy = false
    let webApiUrl = 'https://fortnite-api.com/v2/stats/br/v2?name=';
    let tokenStr = 'e2c3bd1a-1f6f-4383-bf0e-4a4de8cfb6bb';

    const req = await axios.get(webApiUrl + interaction.options.getString("name") + "&timeWindow=season&image=all", { headers: { "Authorization": `${tokenStr}` } }).catch((error) => {
      dumbyyy = true
      interaction.reply("Το account δεν βρέθηκε ή είναι ιδιωτικό.")
    })

    if (dumbyyy === false) {
      const attachment = new AttachmentBuilder(req.data.data.image, "img.png");
      await interaction.deferReply();
      await delay(2500)
      await interaction.editReply({ files: [attachment] });
    } else {
      dumbyyy === false
    }
  },
};