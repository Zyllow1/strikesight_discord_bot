const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    const channelId = '1307440541327425569';
    
    const channel = member.guild.channels.cache.get(channelId);
    
    if (!channel) return;

    const memberCount = member.guild.memberCount;

    const welcomeEmbed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`Bienvenue ${member.user.tag}!`) //
      .setDescription(`Nous sommes heureux de t'accueillir sur notre serveur ! 🎉`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'Bot développé par Strikesight' })
      .setTimestamp();

    // Envoyer l'embed dans le canal
    channel.send({ embeds: [welcomeEmbed] });
  },
};
