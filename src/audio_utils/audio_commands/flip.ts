import {
  AudioCommandHandler,
  VoiceCommand,
  TextToSpeechAction,
} from "../../models";

const FLIP_CHECK_STATIC_WORDS = ["a", "coin"];
export const flipCommand: AudioCommandHandler = (tokens) => {
  // checking for "Echo flip a coin" => already got the "Echo flip" check if tokens are "a coin"
  let result: VoiceCommand = null;
  console.log(`CALLING FLIP: ${tokens}`);
  if (JSON.stringify(tokens) == JSON.stringify(FLIP_CHECK_STATIC_WORDS)) {
    result = {
      action: TextToSpeechAction.PREGENERATED,
      value: (Math.floor(Math.random() * 2) ? "heads" : "tails").concat(".mp3"),
    };
  }
  return result;
};

const test = ["flip", "a", "coin"];

console.log(flipCommand(test.slice(1, 3)));
