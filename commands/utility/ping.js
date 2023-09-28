const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Απαντάει με πόνγκ και δίχνει πόσο καθυστέρηση έχει το bot.'),
	async execute(interaction) {
		var gg1 = '🏓 Πόνγκ! Η τρέχουσα καθυστέρηση είναι: `' + `${Date.now() - interaction.createdTimestamp}` + " ms`"
		await interaction.reply(gg1.replace('-', ''));
	},
};