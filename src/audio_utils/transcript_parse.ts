import { AudioPlayer } from "@discordjs/voice";
import { VoiceCommand, VoiceCommandID } from "../models";
import { flipCommand } from "./audio_commands/flip";
import { giveCommand } from "./audio_commands/give";
import { playCommand } from "./audio_commands/play";
import { tellCommand } from "./audio_commands/tell";
import { stopCommand } from "./audio_commands/stop";

const transcriptParse = async (
  transcript: string,
  player: AudioPlayer
): Promise<VoiceCommand | void> =>
  //: VoiceCommand | undefined
  {
    //   return "hello";
    const split = transcript.toLowerCase().split(" ");
    console.log(split);
    // design choice: if there are multiple 'Echo's, do the latest valid command
    const command_start_indices: number[] = [];
    const test = split.forEach((token, i) => {
      if (token === "echo") {
        command_start_indices.push(i);
      }
    });

    command_start_indices.reverse();

    console.log(command_start_indices);

    // check next word...
    let result = null;
    // check if sub string is valid?
    for (let i = 0; i < command_start_indices.length; i++) {
      if (command_start_indices[i] + 1 > split.length) break;

      // this way of figuring out the commands is a little hacky...
      switch (split[command_start_indices[i] + 1]) {
        case VoiceCommandID.FLIP: {
          result = flipCommand(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 4
            )
          );
          break;
        }
        case VoiceCommandID.GIVE: {
          result = giveCommand(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 9
            )
          );
          break;
        }
        case VoiceCommandID.TELL: {
          result = await tellCommand(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 5
            )
          );
          break;
        }
        case VoiceCommandID.PLAY: {
          result = await playCommand(split.slice(command_start_indices[i] + 2));
          break;
        }
        case VoiceCommandID.STOP: {
          stopCommand(player);
          break;
        }
        default: {
          break;
        }
      }

      if (result) {
        break;
      }
    }
    return result;
  };

export default transcriptParse;
