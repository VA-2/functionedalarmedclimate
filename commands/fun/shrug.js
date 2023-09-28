const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shrug')
		.setDescription('?'),
	async execute(interaction) {
		await interaction.reply("¯\_(ツ)_/¯");
	},
};