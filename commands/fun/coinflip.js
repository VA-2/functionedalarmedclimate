const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Ρίχνει κέρμα.'),
    async execute(interaction) {
        function doRandHT() {
            var rand = ['Κορόνα', 'Γράμματα'];

            return rand[Math.floor(Math.random() * rand.length)];
        }
        await interaction.reply("Ο νικητής είναι: " + doRandHT());
    },
};