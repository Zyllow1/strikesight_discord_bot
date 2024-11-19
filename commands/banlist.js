const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Affiche la liste des membres bannis du serveur'),
  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId)) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" pour utiliser cette commande.', ephemeral: true });
    }

    try {
      const bans = await interaction.guild.bans.fetch();
      
      if (bans.size === 0) {
        return interaction.reply({ content: 'Il n\'y a actuellement aucun membre banni sur ce serveur.' });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#d6a351')
        .setTitle('Liste des Membres Bannis')
        .setDescription(`Il y a actuellement ${bans.size} membre(s) banni(s) du serveur.`)
        .setFooter({ text: 'Bot développé par Strikesight' })
        .setTimestamp();

      bans.forEach((ban) => {
        const banDate = ban.date ? `\`\`\`${ban.date.toLocaleDateString()}\`\`\`` : 'Inconnu';
        const banReason = ban.reason ? `\`\`\`${ban.reason}\`\`\`` : 'Banni par commande slash';
        
        embed.addFields({
          name: `${ban.user.tag}`,
          value: `Banni le : ${banDate} | Raison : ${banReason}`,
          inline: false
        });
      });

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de la récupération de la liste des bannis.', ephemeral: true });
    }
  },
};
