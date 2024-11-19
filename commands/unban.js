const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Débannir un membre du serveur')
    .addStringOption(option => 
      option.setName('id')
        .setDescription('ID de l\'utilisateur à débannir')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('id');
    
    try {
      const bans = await interaction.guild.bans.fetch();
      const ban = bans.get(userId);
      
      if (!ban) {
        return interaction.reply({ content: `Aucun membre trouvé avec l'ID \`${userId}\` dans la liste des bannis.`, ephemeral: true });
      }

      await interaction.guild.bans.remove(userId);
      
      const embed = new EmbedBuilder()
        .setColor('#4caf50')
        .setTitle('Débannissement réussi')
        .setDescription(`L'utilisateur **${ban.user.tag}** a été débanni avec succès du serveur.`)
        .setFooter({ text: 'Bot développé par Strikesight' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de la tentative de débannissement de l\'utilisateur.', ephemeral: true });
    }
  },
};
