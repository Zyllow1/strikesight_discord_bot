const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clientlist')
    .setDescription('Liste tous les membres avec le rôle Client'),

  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId) && !interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" ou être administrateur pour utiliser cette commande.', ephemeral: true });
    }

    const clientRoleId = '1307441384516485210';
    const clientMembers = interaction.guild.members.cache.filter(member => member.roles.cache.has(clientRoleId));

    if (clientMembers.size === 0) {
      return interaction.reply({ content: 'Aucun membre avec le rôle "Client" n\'a été trouvé sur ce serveur.', ephemeral: true });
    }

    const clientList = clientMembers.map(member => `• ${member.user.tag}`).join('\n');

    // Créer l'embed avec EmbedBuilder
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('Liste des clients Strikesight du serveur')
      .setDescription(clientList)
      .setFooter({ text: 'Powered by Strikesight' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
