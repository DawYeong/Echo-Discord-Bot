import speech from "@google-cloud/speech";
import * as fs from "node:fs";

const speechToText = async (filename: string): Promise<string> => {
  const client = new speech.SpeechClient();
  const file = fs.readFileSync(filename);
  const audioBytes = file.toString("base64");

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 1,
    sampleRate: 16000,
    languageCode: "en-US",
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  return transcription;
};

export default speechToText;
