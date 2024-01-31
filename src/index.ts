import * as dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";

import { summonCommandHandler } from "./commands/summon";
import { leaveCommandHandler } from "./commands/leave";

import * as utils from "./models";
import { chessCommandHandler } from "./commands/chess";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", (c) => {
  console.log("The bot is ready.");
});

client.login(process.env.DISCORD_TOKEN || "DEFAULT_TOKEN");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case utils.CommandNames.SUMMON: {
      await summonCommandHandler(interaction);
      break;
    }
    case utils.CommandNames.LEAVE: {
      await leaveCommandHandler(interaction);
      break;
    }
    case utils.CommandNames.CHESS: {
      await chessCommandHandler(interaction);
      break;
    }
    default: {
      interaction.reply("No such command");
      break;
    }
  }
});
