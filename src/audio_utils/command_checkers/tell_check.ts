import { VoiceCommand, CheckHandler, VoiceCommandID } from "../../models";

const TELL_CHECK_STATIC_WORDS = ["me", "a", "joke"];
export const tellCommandCheck: CheckHandler = (tokens) => {
  // checking for "Echo tell me a joke"
  let result: VoiceCommand = null;
  console.log(`CALLING TELL: ${tokens}`);

  if (JSON.stringify(tokens) == JSON.stringify(TELL_CHECK_STATIC_WORDS)) {
    result = {
      command: VoiceCommandID.TELL,
      parameters: [],
    };
  }
  return result;
};

console.log(tellCommandCheck(["me", "a", "joke"]));
