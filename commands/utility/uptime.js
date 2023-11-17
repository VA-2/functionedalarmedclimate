const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Δίχνει πόσα άτομα είναι μέσα στον server.'),
    async execute(interaction) {
        let totalSeconds = (interaction.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `Το μπότ είναι ενεργό εδώ και: ${days} μέρες, ${hours} ώρες, ${minutes} λεπτά και ${seconds} δευτερόλεπτα.`;
        interaction.reply(uptime)
    },
};