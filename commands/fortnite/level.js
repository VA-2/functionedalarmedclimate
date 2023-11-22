const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnitelevel')
        .setDescription('Δίχνει το level ενός account.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Το όνομα του account.')
                .setRequired(true)),
    async execute(interaction) {
        let webApiUrl = 'https://fortnite-api.com/v2/stats/br/v2?name=';
        let tokenStr = 'e2c3bd1a-1f6f-4383-bf0e-4a4de8cfb6bb';

        const req = await axios.get(webApiUrl + interaction.options.getString("name"), { headers: { "Authorization": `${tokenStr}` } })
        interaction.reply("Ο/Η + " + interaction.options.getString("name") + " είναι level " + toString(req.data.data.battlePass.level))
    },
};