const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addclient')
    .setDescription('Ajoute le rôle "Client" à un membre')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Le membre à qui ajouter le rôle')
        .setRequired(true)),

  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId) && !interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" ou être administrateur pour utiliser cette commande.', ephemeral: true });
    }

    const member = interaction.options.getMember('membre');

    if (!member) {
      return interaction.reply({ content: 'Ce membre n\'est pas valide.', ephemeral: true });
    }

    const roleId = '1307441384516485210';

    if (member.roles.cache.has(roleId)) {
      return interaction.reply({ content: `${member.user.tag} a déjà le rôle "Client".`, ephemeral: true });
    }

    try {
      await member.roles.add(roleId);

      try {
        await member.send('Vous avez été ajouté au rôle **Client** sur le serveur Strikesight. Bienvenue !');
      } catch (dmError) {
        console.error('Erreur lors de l\'envoi du DM :', dmError);
        return interaction.reply({ content: 'Le DM n\'a pas pu être envoyé au membre.', ephemeral: true });
      }

      return interaction.reply({ content: `Le rôle "Client" a été ajouté à ${member.user.tag}.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de l\'ajout du rôle.', ephemeral: true });
    }
  },
};
