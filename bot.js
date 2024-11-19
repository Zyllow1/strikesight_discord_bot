const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');
const axios = require('axios');
const { token, clientId, guildId } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ] 
});

client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const statusChannelId = '1308148602815647836';
const linksChannelId = '1308179867464106024';
let statusMessage = null;
let linksMessage = null;

async function checkSiteStatus(url) {
    try {
      const start = Date.now();
      const response = await axios.get(url);
      const end = Date.now();
      const ping = end - start;
      return {
        status: response.status === 200 ? '🟢 En ligne' : '🔴 Hors ligne',
        ping: `${ping}ms`,
      };
    } catch (error) {
      return {
        status: '🔴 Hors ligne',
        ping: 'N/A',
      };
    }
}

async function sendLinksMessage() {
  const button1 = new ButtonBuilder()
    .setLabel('Site Strikesight')
    .setStyle(ButtonStyle.Link)
    .setURL('https://www.strikesight.fr/');

  const button2 = new ButtonBuilder()
    .setLabel('Panel Strikesight')
    .setStyle(ButtonStyle.Link)
    .setURL('https://panel.strikesight.fr');

  const button3 = new ButtonBuilder()
    .setLabel('Keymaster')
    .setStyle(ButtonStyle.Link)
    .setURL('https://keymaster.fivem.net');

  const row = new ActionRowBuilder().addComponents(button1, button2, button3);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Liens principaux de Strikesight')
    .setDescription('Voici les liens principaux de Strikesight que vous pouvez utiliser :')
    .setFooter({ text: 'Powered by Strikesight' });

  try {
    const channel = await client.channels.fetch(linksChannelId);

    if (linksMessage) {
      await linksMessage.edit({ embeds: [embed], components: [row] });
      console.log(`Le message des liens a été mis à jour.`);
    } else {
      linksMessage = await channel.send({ embeds: [embed], components: [row] });
      console.log(`Un nouveau message des liens a été envoyé.`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message dans le salon des liens:', error);
  }
}

async function sendStatusMessage() {
    const site = await checkSiteStatus('https://www.strikesight.fr');
    const panel = await checkSiteStatus('https://panel.strikesight.fr');
    const api = await checkSiteStatus('https://panel.strikesight.fr/add_ip.php');
    const bot = await checkSiteStatus('https://game.yorkhost.fr/server/c7df4ffd');
    const support = await checkSiteStatus('https://support.strikesight.fr/');

    const currentTime = new Date();
    const formattedDate = currentTime.toLocaleString('fr-FR', { hour12: false });
    const today = `Aujourd'hui à ${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

    const offlineServices = [site, panel, api, bot, support].filter(service => service.status === '🔴 Hors ligne').length;

    let color = '#00FF00';
    if (offlineServices === 1 || offlineServices === 2) {
        color = '#FFA500';
    } else if (offlineServices >= 3) {
        color = '#FF0000';
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({
          name: 'Strikesight - Statut serveur',
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(`
            > **Site Strikesight** : \`\`\`${site.status} (${site.ping})\`\`\` 
            > **Panel Strikesight** : \`\`\`${panel.status} (${panel.ping})\`\`\`
            > **API Strikesight** : \`\`\`${api.status} (${api.ping})\`\`\`
            > **Bot Strikesight** : \`\`\`${bot.status} (${bot.ping})\`\`\`
            > **Support Strikesight** : \`\`\`${support.status} (${support.ping})\`\`\`
        `)
        .setFooter({ text: `Powered by Strikesight • Dernière actualisation : ${formattedDate} • ${today}` })
        .setThumbnail('https://media.discordapp.net/attachments/1066485981760475137/1308174059774804079/strikesight2.png?ex=673cfb88&is=673baa08&hm=6c2864ebf45356bdb85c9e2e9d16d5937beab005251944d9159496300a981912&=&format=webp&quality=lossless');

    try {
        const channel = await client.channels.fetch(statusChannelId);

        if (statusMessage) {
            await statusMessage.edit({ embeds: [embed] });
            console.log(`Le message de statut a été mis à jour.`);
        } else {
            statusMessage = await channel.send({ embeds: [embed] });
            console.log(`Un nouveau message de statut a été envoyé.`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message de statut:', error);
    }
}

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: 'le meilleur anti cheat',
        type: 3,
      }
    ],
    status: 'online',
  });

  console.log("Statut d'activité mis à jour.");

  sendLinksMessage();
  sendStatusMessage();

  setInterval(sendLinksMessage, 300000);
  setInterval(sendStatusMessage, 60000);
});

const commands = [];
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Début de l\'enregistrement des commandes...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log('Commandes enregistrées avec succès !');
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);
