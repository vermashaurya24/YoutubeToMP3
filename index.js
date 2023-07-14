const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const downloadMP3 = async (url) => {
  try {
    //Metadata and audioformat are required for downloading an audio file.
    const metaData = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(metaData.formats, {
      quality: "highestaudio",
    });

    console.log("Downloading " + metaData.videoDetails.title + " ...");

    //The path at which the audio fill will be downloaded is stored in the rootPath variable. If it does not end with a '/', we add it.
    const rootPath = process.env.DOWNLOAD_PATH;
    if (rootPath && rootPath.charAt(rootPath.length - 1) !== "/") {
      rootPath += "/";
    }

    //The format of the audio file will be <Name_of_video_file>.mp3.
    const filename = path.join(
      (rootPath ? rootPath : "") +
        metaData.videoDetails.title.replace(/\W/g, "") +
        ".mp3"
    );

    //The function that converts the video format to audio format. It creates a new WriteStream at the filename path, and pipes the downloaded data format into this stream. Upon completion, we are shown the acknowledgement message.
    ytdl(url, { format: audioFormat })
      .pipe(fs.createWriteStream(filename))
      .on("finish", () => {
        console.log("Download complete. File saved as: " + filename);
      });
  } catch (error) {
    //In case any error occurs during the conversion process, we catch it here.
    console.log({ msg: error.message });
  }
};

const mainDownloader = () => {
  const url = process.argv[2];
  if (!url) {
    return console.log(
      "Invalid input. Please follow input format: node index.js <youtube_url>"
    );
  } else {
    downloadMP3(url);
  }
};

mainDownloader();
