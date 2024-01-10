import {
  AudioCommandHandler,
  VoiceCommand,
  TextToSpeechAction,
} from "../../models";

import * as ytMusic from "node-youtube-music";
import * as ytdl from "ytdl-core";
import * as ffmpeg from "fluent-ffmpeg";
import * as path from "path";

export const playCommand: AudioCommandHandler = async (tokens) => {
  let result: VoiceCommand = null;
  const youtube_id = (await ytMusic.searchMusics(tokens.join("")))[0].youtubeId;

  const stream = ytdl(youtube_id, {
    quality: "highestaudio",
  });
  const filename = path.join(__dirname, `../youtube-${Date.now()}.mp3`);

  // a way to make sure to return only when the file is finished downloading
  // await new Promise((resolve: any) => {
  //   ffmpeg(stream)
  //     .audioBitrate(128)
  //     .save(filename)
  //     .on("end", () => {
  //       resolve("finish");
  //     });
  // });

  // result = {
  //   action: TextToSpeechAction.MUSIC,
  //   value: filename,
  // };

  result = {
    action: TextToSpeechAction.MUSIC,
    stream: stream,
  };
  return result;
};
