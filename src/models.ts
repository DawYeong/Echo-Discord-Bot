import { Transform } from "node:stream";
import type { CommandInteraction, InteractionResponse } from "discord.js";

export type CommandHandler = (
  interaction: CommandInteraction
) => void | Promise<void> | Promise<InteractionResponse<boolean> | undefined>;

export enum VoiceCommandID {
  TELL = "tell",
  GIVE = "give",
  FLIP = "flip",
}

export enum TextToSpeechAction {
  PREGENERATED,
  GENERATE,
}

export type VoiceCommand = {
  action: TextToSpeechAction;
  value: string;
};

export type AudioCommandHandler = (
  tokens: string[]
) => void | VoiceCommand | Promise<VoiceCommand>;

export enum CommandNames {
  SUMMON = "summon",
  LEAVE = "leave",
}

// based on this https://github.com/Yvtq8K3n/BobbyMcLovin/blob/3a007a675d36f61c89e1151293250f6cb0a441b9/index.js
export class OpusDecodingStream extends Transform {
  encoder;

  constructor(options: any, encoder: any) {
    super(options);
    this.encoder = encoder;
  }

  _transform(data: any, encoding: any, callback: any) {
    this.push(this.encoder.decode(data));
    callback();
  }
}
