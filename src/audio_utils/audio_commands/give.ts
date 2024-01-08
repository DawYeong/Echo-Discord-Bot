import {
  AudioCommandHandler,
  VoiceCommand,
  TextToSpeechAction,
} from "../../models";

const GIVE_CHECK_STATIC_WORDS = ["me", "a", "number"];
const STATIC_VARIATION_1 = ["between", "and"];
const STATIC_VARIATION_2 = ["from", "to"];

export const giveCommand: AudioCommandHandler = (tokens) => {
  // Check "Echo give me a number between/from x and/to y"
  // needs to check "me a number between/from x and/to y"
  let result: VoiceCommand = null;
  console.log(`CALLING GIVE: ${tokens}`);

  // checks for static words
  if (
    tokens.length != 7 ||
    JSON.stringify(tokens.slice(0, 3)) !=
      JSON.stringify(GIVE_CHECK_STATIC_WORDS.slice(0, 3)) ||
    !(
      (tokens[3] === STATIC_VARIATION_1[0] &&
        tokens[5] === STATIC_VARIATION_1[1]) ||
      (tokens[3] === STATIC_VARIATION_2[0] &&
        tokens[5] === STATIC_VARIATION_2[1])
    )
  )
    return result;

  // check if x and y are numerics and x < y
  const x = Number(tokens[4]);
  const y = Number(tokens[6]);

  if (!Number.isNaN(x) && !Number.isNaN(y) && x < y) {
    result = {
      action: TextToSpeechAction.GENERATE,
      value: Math.floor(Math.random() * (y + 1 - x) + x).toString(),
    };
  }

  return result;
};

console.log(giveCommand(["me", "a", "number", "between", "x", "and", "y"]));
console.log(giveCommand(["me", "a", "number", "from", "x", "to", "y"]));
console.log(giveCommand(["me", "a", "number", "between", "x", "to", "y"]));
console.log(giveCommand(["me", "a", "number", "from", "x", "and", "y"]));
console.log(giveCommand(["me", "a", "number", "from", "-5", "to", "5"]));
console.log(giveCommand(["me", "a", "number", "between", "10", "and", "15"]));
console.log(giveCommand(["me", "a", "number", "between", "10", "and", "-5"]));
