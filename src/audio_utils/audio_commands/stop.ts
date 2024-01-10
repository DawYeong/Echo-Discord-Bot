import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";

export const stopCommand = (player: AudioPlayer) => {
  if (player.state.status == AudioPlayerStatus.Idle) {
    console.log("audio player is idle");
  } else {
    player.stop(true);
    console.log("player stopped");
  }
};
