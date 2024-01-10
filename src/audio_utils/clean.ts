import * as fs from "fs";
import * as path from "path";

// clean mp3 files generated under audio_utils/
const cleanAudioFiles = () => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (path.extname(file).slice(1) == "mp3") {
      console.log(file);
      fs.unlink(__dirname + "/" + file, (err) => {
        // throwing an error will crash the bot
        if (err) {
          console.log(`Error trying to delete: ${file}, ${err}`);
          return;
        }
        console.log(`${file} was deleted`);
      });
    }
  });
};

export default cleanAudioFiles;
