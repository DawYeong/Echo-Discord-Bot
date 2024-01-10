// import { searchMusics } from "node-youtube-music";
import * as ytMusic from "node-youtube-music";
import * as ytdl from "ytdl-core";
import * as fs from "fs";
import * as ffmpeg from "fluent-ffmpeg";
import * as readline from "readline";
// var nytm = require("node-youtube-music");

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";

const test = async () => {
  const musics = await ytMusic.searchMusics("tip toe by hybs");
  console.log(musics[0]);

  const id = musics[0].youtubeId;
  let stream = ytdl(id, {
    quality: "highestaudio",
  });

  // let start = Date.now();
  // let result: string = await new Promise((resolve) => {
  //   ffmpeg(stream)
  //     .audioBitrate(128)
  //     .save(`${__dirname}/${id}.mp3`)
  //     .on("progress", (p) => {
  //       readline.cursorTo(process.stdout, 0);
  //       process.stdout.write(`${p.targetSize}kb downloaded`);
  //     })
  //     .on("end", () => {
  //       console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
  //       resolve(`${__dirname}/${id}.mp3`);
  //     });
  // });

  // console.log(result);

  // return result;
  return "";
};

let result = test();

result.then((x) => {
  console.log(fs.existsSync(x));
});
