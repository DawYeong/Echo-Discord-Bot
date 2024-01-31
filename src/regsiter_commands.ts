import * as dotenv from "dotenv";
dotenv.config();

import { REST, Routes, ApplicationCommandOption } from "discord.js";

const COMMANDS = [
  {
    name: "summon",
    description: "Summons Echo bot.",
  },
  {
    name: "leave",
    description: "Makes Echo bot leave voice channel.",
  },
  {
    name: "chess",
    description: "Plays chess",
  },
];

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_TOKEN || "DEFAULT_TOKEN"
);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID || "CLIENT_ID",
        process.env.GUILD_ID || "GUILD_ID"
      ),
      //   Routes.applicationCommands(process.env.CLIENT_ID || "CLIENT_ID"),
      { body: COMMANDS }
    );

    console.log("Commands were registered successfully!");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
