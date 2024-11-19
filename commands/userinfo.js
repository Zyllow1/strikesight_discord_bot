const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Affiche les informations d\'un utilisateur')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('L\'utilisateur dont vous voulez voir les informations')
        .setRequired(false)),
  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId)) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" pour utiliser cette commande.', ephemeral: true });
    }

    const user = interaction.options.getUser('utilisateur') || interaction.user;

    const embed = new EmbedBuilder()
      .setColor('#d6a351')
      .setTitle(`Informations de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID de l\'utilisateur', value: `\`\`\`${user.id}\`\`\``, inline: true },
        { name: 'Date de création du compte', value: `\`\`\`${user.createdAt.toLocaleDateString()}\`\`\``, inline: true },
        { name: 'Date d\'adhésion au serveur', value: `\`\`\`${interaction.guild.members.cache.get(user.id)?.joinedAt?.toLocaleDateString() || 'Inconnu'}\`\`\``, inline: true },
        { name: 'Statut actuel', value: `\`\`\`${user.presence?.status || 'Indisponible'}\`\`\``, inline: true },
        { name: 'Bot ?', value: `\`\`\`${user.bot ? 'Oui' : 'Non'}\`\`\``, inline: true }
      )
      .setFooter({ text: 'Bot développé par Strikesight' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
