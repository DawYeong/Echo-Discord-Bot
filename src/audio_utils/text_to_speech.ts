import * as tts from "@google-cloud/text-to-speech";
import * as util from "util";
import * as fs from "node:fs";
import * as path from "path";

const textToSpeech = async (text: string) => {
  const client = new tts.TextToSpeechClient();

  const request: tts.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
    {
      input: { text: text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

  const [response] = await client.synthesizeSpeech(request);

  const writeFile = util.promisify(fs.writeFile);

  const filename = path.join(__dirname, `echo_output-${Date.now()}.mp3`);
  await writeFile(filename, response.audioContent, "binary");
};

export default textToSpeech;
