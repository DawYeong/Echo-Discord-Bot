import { getVoiceConnection } from "@discordjs/voice";
import { CommandHandler } from "../models";
import * as ffmpeg from "ffmpeg";
import cleanAudioFiles from "../audio_utils/clean";

export const leaveCommandHandler: CommandHandler = async (interaction) => {
  if (!interaction.guildId) return interaction.reply("Cannot find guild id.");
  const guild = interaction.client.guilds.cache.get(interaction.guildId);

  if (!guild || !interaction.guild)
    return interaction.reply("Cannot find guild.");
  const member = guild.members.cache.get(interaction.user.id);

  if (!member?.voice.channel)
    return interaction.reply("User is not in a voice channel.");

  // check if bot is in a voice channel already
  // could've put the previous check into a function but compiler does not know that interaction.guildId is a guaranteed string...
  let bot_connection = getVoiceConnection(interaction.guildId);

  if (bot_connection) {
    if (member.voice.channel.id === bot_connection.joinConfig.channelId) {
      bot_connection.disconnect();
      cleanAudioFiles();
      return interaction.reply("Goodbye!");
    } else {
      return interaction.reply(
        "User must be in the same voice channel as me to make me leave."
      );
    }
  } else {
    return interaction.reply(
      "Can't leave if I'm not in a voice channel. Bozo."
    );
  }
};
