import {
  AudioCommandHandler,
  VoiceCommand,
  TextToSpeechAction,
} from "../../models";
var giveMeAJoke = require("give-me-a-joke");

const TELL_CHECK_STATIC_WORDS = ["me", "a", "joke"];
export const tellCommand: AudioCommandHandler = async (tokens) => {
  let result: VoiceCommand = null;
  console.log(`CALLING TELL: ${tokens}`);

  if (JSON.stringify(tokens) == JSON.stringify(TELL_CHECK_STATIC_WORDS)) {
    result = {
      action: TextToSpeechAction.GENERATE,
      value: await new Promise((resolve) => {
        giveMeAJoke.getRandomDadJoke(function (joke: any) {
          resolve(joke);
        });
      }),
    };
  }
  return result;
};

console.log(tellCommand(["me", "a", "joke"]));
