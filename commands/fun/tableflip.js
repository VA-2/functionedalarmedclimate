const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gc-tableflip')
		.setDescription(':('),
	async execute(interaction) {
		await interaction.reply("(╯°□°）╯︵ ┻━┻");
	},
};