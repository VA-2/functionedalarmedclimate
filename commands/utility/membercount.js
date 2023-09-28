const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Δίχνει πόσα άτομα είναι μέσα στον server.'),
    async execute(interaction) {
        const memberss = interaction.guild.memberCount;
        console.log(memberss)
        await interaction.reply("Ο server αυτή τη στιγμή έχει " + memberss + " άτομα, μαζί με τα bot.");
    },
};