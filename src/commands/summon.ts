import { CommandHandler, TextToSpeechAction } from "../models";
import { Readable } from "node:stream";
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
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import * as path from "path";
import recordVoiceAudio from "../audio_utils/record_voice_audio";
import speechToText from "../audio_utils/speech_to_text";
import transcriptParse from "../audio_utils/transcript_parse";
import textToSpeech from "../audio_utils/text_to_speech";
import cleanAudioFiles from "../audio_utils/clean";

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
  interaction.reply("I have been summoned :smiling_imp:");
  await entersState(bot_connection, VoiceConnectionStatus.Ready, 20e3);
  console.log(`Bot connected to voice channel: ${member.voice.channel.name}`);

  const receiver = bot_connection.receiver;
  const player = createAudioPlayer();
  bot_connection.subscribe(player);

  receiver.speaking.on("start", async (userId) => {
    let bot_output: string | Readable | null = null;
    let user_file = null;
    try {
      user_file = await recordVoiceAudio(receiver, userId);
      console.log(`user_file: ${user_file}`);
      if (!user_file) return;
      // translate the recording => delete recording after
      const transcript = await speechToText(user_file);
      console.log(`Transcript: ${transcript}`);
      if (!transcript) return;
      // figure out if it is a command => parsing and filtering
      const voiceCommand = await transcriptParse(transcript, player);
      console.log(`Voice Command: ${voiceCommand}`);
      if (!voiceCommand) return;

      if (player.state.status == AudioPlayerStatus.Playing) {
        // ignore bot outputs if audio is currently playing
        console.log("command ignored, player is currently playing");
        return;
      }

      switch (voiceCommand.action) {
        case TextToSpeechAction.PREGENERATED: {
          bot_output = path.join(
            __dirname,
            `../audio_utils/pregenerated/${voiceCommand.value}`
          );
          break;
        }
        case TextToSpeechAction.TTS: {
          bot_output = await textToSpeech(voiceCommand.value);
          break;
        }
        case TextToSpeechAction.MUSIC: {
          bot_output = voiceCommand.stream;
          break;
        }
        default: {
          break;
        }
      }

      console.log(`bot_output: ${bot_output}`);
      console.log(player.state);
      player.play(createAudioResource(bot_output));
    } catch (error) {
      console.log(error);
      cleanAudioFiles();
    }
  });
};
