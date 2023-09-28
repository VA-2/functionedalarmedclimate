const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomnum')
		.setDescription('Δίνει έναν τυχαίο αριθμό.')
        .addStringOption(option =>
            option
                .setName('highnum')
                .setDescription('Ο μεγαλύτερος αριθμός.')
                .setRequired(true)),
	async execute(interaction) {
		const yeees3 = await interaction.options.getString("lownum")
        const yeees32 = await interaction.options.getString("highnum")
        console.log(yeees3)
        console.log(yeees32)
        function randomIntFromInterval(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - 1 + 1) + 1)
        } 
        const rndInt = randomIntFromInterval(yeees3, yeees32)
        interaction.reply("Ο αριθμός είναι: " + rndInt)
	},
};