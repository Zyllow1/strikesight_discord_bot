const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un certain nombre de messages dans le canal')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Le nombre de messages à supprimer')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),

  async execute(interaction) {
    const moderatorRoleId = '1307803548989526016';
    if (!interaction.member.roles.cache.has(moderatorRoleId)) {
      return interaction.reply({ content: 'Désolé, vous devez avoir le rôle "Moderator" pour utiliser cette commande.', ephemeral: true });
    }

    const numberOfMessages = interaction.options.getInteger('nombre');

    try {
      await interaction.channel.bulkDelete(numberOfMessages, true);

      return interaction.reply({ content: `${numberOfMessages} message(s) ont été supprimés.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'Une erreur est survenue lors de la suppression des messages.', ephemeral: true });
    }
  },
};
