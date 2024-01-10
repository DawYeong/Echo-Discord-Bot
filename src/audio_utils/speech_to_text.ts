import * as dotenv from "dotenv";
dotenv.config();

import speech from "@google-cloud/speech";
import * as fs from "node:fs";

const CLIENT = new speech.SpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID || "GOOGLE_PROJECT_ID",
  key: process.env.GOOGLE_PROJECT_KEY || "GOOGLE_PROJECT_KEY",
});

const speechToText = async (filename: string): Promise<string> => {
  const start = Date.now();
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

  const [response] = await CLIENT.recognize(request);

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  console.log(`Done ${(Date.now() - start) / 1000}s: ${transcription}`);
  return transcription;
};

export default speechToText;
