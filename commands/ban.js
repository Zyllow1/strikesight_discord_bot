const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre du serveur')
    .addUserOption(option =>
      option.setName('utilisateur')
        .setDescription('Le membre à bannir')
        .setRequired(true)),
  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId)) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" pour utiliser cette commande.', ephemeral: true });
    }

    const user = interaction.options.getUser('utilisateur');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Ce membre n\'est pas dans le serveur.', ephemeral: true });
    }

    try {
      await member.ban({ reason: 'Banni par commande slash.' });
      return interaction.reply({ content: `${user.tag} a été banni du serveur.` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors du bannissement du membre.', ephemeral: true });
    }
  },
};
