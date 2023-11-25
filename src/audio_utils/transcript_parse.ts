import { VoiceCommand, VoiceCommandID } from "../models";
import { flipCommandCheck } from "./command_checkers/flip_check";
import { giveCommandCheck } from "./command_checkers/give_check";
import { tellCommandCheck } from "./command_checkers/tell_check";

const transcript_parse = (transcript: string): VoiceCommand | void =>
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
          result = flipCommandCheck(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 4
            )
          );
          break;
        }
        case VoiceCommandID.GIVE: {
          result = giveCommandCheck(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 9
            )
          );
          break;
        }
        case VoiceCommandID.TELL: {
          result = tellCommandCheck(
            split.slice(
              command_start_indices[i] + 2,
              command_start_indices[i] + 5
            )
          );
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

// tests

console.log(
  transcript_parse(
    "Echo flip a coin Echo tell me a joke Echo Echo tell Echo flip a Coin Echo flip"
  )
);
console.log(transcript_parse("Echo tell me a joke"));
console.log(transcript_parse("Echo give me a number from 1 to 10"));
console.log(transcript_parse("Echo give me a number from 10 to 1"));
console.log(transcript_parse("Echo give"));
console.log(transcript_parse("Echo print"));
console.log(
  transcript_parse(
    "Echo tell me a joke Echo Echo tell Echo flip a Coin Echo flip"
  )
);

// transcript_parse("Echo flip a coin");
// transcript_parse("Echo tell me a joke");
// transcript_parse("more yapping more yapping boy rapping Echo flip a coin");
