import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { setTimeout } from "node:timers/promises";
import { CommandHandler } from "../models";
import ChessGameEngine from "../chess_engine/chess_game_engine";
import {
  COL_TO_NUMBER_MAP,
  ROW_TO_NUMBER_MAP,
} from "../chess_engine/utils/chess_utils";

// const file = new AttachmentBuilder("/home/bdylamubuntu/projects/Echo/dog.jpg");
// const file2 = new AttachmentBuilder("/home/bdylamubuntu/projects/Echo/cat.jpg");

export const chessCommandHandler: CommandHandler = async (interaction) => {
  const cge: ChessGameEngine = new ChessGameEngine();

  // game start...
  const file = new AttachmentBuilder(cge.display());
  const embed = new EmbedBuilder()
    .setTitle("Chess game")
    .setDescription("Chess game description")
    .setColor("Random")
    .setImage("attachment://board_state.png");
  cge.generateAllValidMoves();
  const options = cge.getValidPieces();
  const select_menu = new StringSelectMenuBuilder()
    .setCustomId("piece")
    .setMaxValues(1)
    .addOptions(
      options.map((opt) =>
        new StringSelectMenuOptionBuilder().setLabel(opt).setValue(opt)
      )
    );
  let action_row =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select_menu);

  const reply = await interaction.reply({
    embeds: [embed],
    files: [file],
    components: [action_row],
  });

  const collector_string = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    // filter: (i) =>
    //   i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 600000,
  });

  const collector_button = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 600000,
  });

  collector_string.on("collect", async (i) => {
    switch (i.customId) {
      case "piece": {
        const piece = i.values[0].split(" ")[0];
        const piece_location = [
          COL_TO_NUMBER_MAP[piece[0]],
          ROW_TO_NUMBER_MAP[piece[1]],
        ].join(",");
        cge.selectPiece(piece_location);
        const piece_moves = cge.getPieceMoves(piece_location);

        // await i.update({ content: i.values[0] });
        const move_menu = new StringSelectMenuBuilder()
          .setCustomId("moves")
          .setMaxValues(1)
          .addOptions(
            piece_moves.map((move) =>
              new StringSelectMenuOptionBuilder().setLabel(move).setValue(move)
            )
          );
        const back_button = new ButtonBuilder()
          .setCustomId("back")
          .setLabel("Back")
          .setStyle(ButtonStyle.Primary);

        const move_row =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            move_menu
          );

        const back_row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          back_button
        );
        const new_embed = new EmbedBuilder(embed.data);
        new_embed.addFields({ name: "Selected Piece:", value: piece });
        await i.update({
          embeds: [new_embed],
          files: [file],
          components: [move_row, back_row],
        });
        break;
      }
      case "moves": {
        // move piece
        const move_location = [
          COL_TO_NUMBER_MAP[i.values[0][0]],
          ROW_TO_NUMBER_MAP[i.values[0][1]],
        ].join(",");

        cge.move(move_location);
        cge.display();
        cge.generateAllValidMoves();
        const options = cge.getValidPieces();

        if (!options.length) {
          embed.addFields({
            name: "GAME OVER:",
            value: `${!cge.turn ? "Black" : "White"} wins!`,
          });
          await i.update({
            embeds: [embed],
            files: [file],
            components: [],
          });
        } else {
          const select_menu = new StringSelectMenuBuilder()
            .setCustomId("piece")
            .setMaxValues(1)
            .addOptions(
              options.map((opt) =>
                new StringSelectMenuOptionBuilder().setLabel(opt).setValue(opt)
              )
            );
          action_row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              select_menu
            );
          await i.update({
            embeds: [embed],
            files: [file],
            components: [action_row],
          });
        }
      }
    }
  });

  collector_button.on("collect", async (i) => {
    switch (i.customId) {
      case "back": {
        // reselect
        cge.display();
        await i.update({
          embeds: [embed],
          files: [file],
          components: [action_row],
        });

        break;
      }
    }
  });
  //   await interaction.editReply(res);
  // await i.editReply(res);
  // console.log(i.values);
  // });
  // await setTimeout(2000);
  // console.log("HERE");
  // await interaction.editReply({
  //   embeds: [embed2],
  //   files: [file2],
  // });
};
