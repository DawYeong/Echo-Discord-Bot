import { VoiceCommand, CheckHandler, VoiceCommandID } from "../../models";

const FLIP_CHECK_STATIC_WORDS = ["a", "coin"];
export const flipCommandCheck: CheckHandler = (tokens) => {
  // checking for "Echo flip a coin" => already got the "Echo flip" check if tokens are "a coin"
  let result: VoiceCommand = null;
  console.log(`CALLING FLIP: ${tokens}`);
  if (JSON.stringify(tokens) == JSON.stringify(FLIP_CHECK_STATIC_WORDS)) {
    result = {
      command: VoiceCommandID.FLIP,
      parameters: [],
    };
  }
  return result;
};

const test = ["flip", "a", "coin"];

console.log(flipCommandCheck(test.slice(1, 3)));
