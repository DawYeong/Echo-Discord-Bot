import { OpusDecodingStream } from "../models";
import { VoiceReceiver, EndBehaviorType } from "@discordjs/voice";
import { pipeline } from "node:stream";
import { OpusEncoder } from "@discordjs/opus";
import { FileWriter } from "wav";
import * as path from "path";

const recordVoiceAudio = async (
  receiver: VoiceReceiver,
  userId: string
): Promise<string | null> => {
  const encoder = new OpusEncoder(16000, 1);
  const filename = path.join(__dirname, `${userId}-${Date.now()}.mp3`);
  const listenStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 100,
    },
  });
  const decodingStream = new OpusDecodingStream({}, encoder);
  const fileWriter = new FileWriter(filename, {
    channels: 1,
    sampleRate: 16000,
  });

  let res: string | null = await new Promise((resolve) => {
    pipeline(listenStream, decodingStream, fileWriter, (err) => {
      if (err) {
        console.log(`Issue recording audio: ${err}`);
        resolve(null);
      } else {
        console.log(`Successfully recorded: ${filename}`);
        resolve(filename);
      }
    });
  });
  return res;
};

export default recordVoiceAudio;
