const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gc-unflip')
		.setDescription(':|'),
	async execute(interaction) {
		await interaction.reply("┬─┬ ノ( ゜-゜ノ)");
	},
};