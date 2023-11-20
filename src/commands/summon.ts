import { CommandHandler } from "../models";
import * as fs from "node:fs";
import * as prism from "prism-media";
import { pipeline } from "node:stream";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
  entersState,
  EndBehaviorType,
  VoiceReceiver,
} from "@discordjs/voice";
import recordVoiceAudio from "../utils/audio_utils";

export const summonCommandHandler: CommandHandler = async (interaction) => {
  if (!interaction.guildId) return interaction.reply("Cannot find guild id.");
  const guild = interaction.client.guilds.cache.get(interaction.guildId);

  if (!guild || !interaction.guild)
    return interaction.reply("Cannot find guild.");
  const member = guild.members.cache.get(interaction.user.id);

  if (!member?.voice.channel)
    return interaction.reply("User is not in a voice channel.");

  // check if bot is in a voice channel already
  let bot_connection = getVoiceConnection(interaction.guildId);
  const user_voice_channel_id = member.voice.channel.id;
  if (!bot_connection) {
    bot_connection = joinVoiceChannel({
      channelId: user_voice_channel_id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
  } else {
    if (bot_connection.joinConfig.channelId === user_voice_channel_id) {
      // already in the same voice channel
      return interaction.reply("Already in the same voice channel");
    } else {
      // different voice channels, have bot rejoin
      bot_connection.rejoin({
        channelId: user_voice_channel_id,
        selfDeaf: false,
        selfMute: false,
      });
    }
  }

  await entersState(bot_connection, VoiceConnectionStatus.Ready, 20e3);
  console.log(`Bot connected to voice channel: ${member.voice.channel.name}`);

  const receiver = bot_connection.receiver;

  receiver.speaking.on("start", async (userId) => {
    // record voice audio
    const fileName = recordVoiceAudio(receiver, userId);
    if (!fileName) return;

    // translate the recording => delete recording after

    // figure out if it is a command => parsing and filtering
  });
};

// const Discord = require('discord.js'); const client = new Discord.Client();
// client.on('message', message => { if (message.content === '!record') { // First, we need to check if the user is in a voice channel if (!message.member.voice.channel) { return message.reply('You need to be in a voice channel to record audio!'); }
// // Now, we can start recording audio from the voice channel
// const connection = await message.member.voice.channel.join();
// const audio = connection.receiver.createStream(message.member);

// // Create a new file and save the audio to it
// const file = fs.createWriteStream('recording.pcm');
// audio.pipe(file);

// // Let the user know that the recording has started
// message.reply('Started recording audio in the voice channel.');
// } });
