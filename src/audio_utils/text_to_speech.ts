import * as dotenv from "dotenv";
dotenv.config();

import * as tts from "@google-cloud/text-to-speech";
import * as util from "util";
import * as fs from "node:fs";
import * as path from "path";

const CLIENT = new tts.TextToSpeechClient({
  projectId: process.env.GOOGLE_PROJECT_ID || "GOOGLE_PROJECT_ID",
  key: process.env.GOOGLE_PROJECT_KEY || "GOOGLE_PROJECT_KEY",
});

const textToSpeech = async (text: string): Promise<string> => {
  const start = Date.now();

  const request: tts.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
    {
      input: { text: text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

  const [response] = await CLIENT.synthesizeSpeech(request);

  const writeFile = util.promisify(fs.writeFile);

  const filename = path.join(__dirname, `echo_output-${Date.now()}.mp3`);
  await writeFile(filename, response.audioContent, "binary");

  console.log(`Done ${(Date.now() - start) / 1000}s: ${filename}`);
  return filename;
};

export default textToSpeech;
