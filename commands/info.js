const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('infobot')
    .setDescription('Affiche les informations du bot'),

  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;
    const formattedApiPing = `${apiPing}ms`;

    const embed = new EmbedBuilder()
      .setColor('#d6a351')
      .setTitle('Informations du Bot')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        { name: 'Latence du Bot', value: `\`\`\`${ping}ms\`\`\``, inline: true },
        { name: 'Latence API', value: `\`\`\`${formattedApiPing}\`\`\``, inline: true },
        { name: 'Serveur', value: `\`\`\`${interaction.guild.name}\`\`\``, inline: true },
        { name: 'Date de connexion', value: `\`\`\`${interaction.client.user.createdAt.toLocaleString()}\`\`\``, inline: false },
        { name: 'Bot Statut', value: `\`\`\`${interaction.client.user.presence.status || 'N/A'}\`\`\``, inline: true },
        { name: 'Version du Bot', value: `\`\`\`v1.0.0\`\`\``, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Bot développé par Strikesight' });

    await interaction.reply({ content: ' ', embeds: [embed] });
  },
};
