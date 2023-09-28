const { SlashCommandBuilder } = require('discord.js');

function toCelsius(kelvin) {
  if (Number.isFinite(kelvin)) { // Checking if kelvin is a number.
    const KELVIN_CELSIUS_DIFF = 273.15; // maybe unnecessary here, but it is good practice to avoid magic numbers.
    let celsius = kelvin - KELVIN_CELSIUS_DIFF;
    return celsius; // could also be just return kelvin - KELVIN_CELSIUS_DIFF;
  } else {
    // kelvin is not a number, should be handled.
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weatherbyzip')
    .setDescription('Λέει τον καιρό, βασίζοντας στον ταχυδρομικό κώδικα.')
    .addStringOption(option =>
      option
        .setName('zipcode')
        .setDescription('Ταχυδρομικός κώδικας.')
        .setRequired(true)),
  async execute(interaction) {
    const yeees3 = await interaction.options.getString("zipcode")
    if (yeees3.length !== 5) {
      interaction.reply("no weder for you shanjeet...")
    } else {
      let lat;
      let long;
      async function geocode(zc) {
        let wea;
        const jsonss = await fetch("https://geocode.maps.co/search?q=" + zc + "+GR").then(u => u.json()).then(j => wea = j);
        lat = jsonss[0].lat
        long = jsonss[0].lon
      }
      await geocode(yeees3)
      let eeerreer;
      const weather = await fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=dbbb39970915e69b3cc5fc8ee7fdb9b1').then(u => u.json()).then(j => eeerreer = j);
      await interaction.reply("...")
      await interaction.editReply(
        `
Ο τρεχών καιρός 🌤️:
Τοποθεσία: ${eeerreer.name}, ${eeerreer.sys.country}
Πρόβλεψη: ${eeerreer.weather[0].main}
Τρέχουσα θερμοκρασία: ${(toCelsius(eeerreer.main.temp)).toFixed()}° C
Υψηλότερη θερμοκρασία ημέρας: ${(toCelsius(eeerreer.main.temp_max)).toFixed()}° C
Χαμηλότερη θερμοκρασία ημέρας: ${(toCelsius(eeerreer.main.temp_min)).toFixed()}° C
`
      )
    }
  },
};