// function to know the type of the file from mimetype
const getFileTypeFromMime = (mime, ext) => {
  if (
    (mime === "video/mp4" ||
      mime === "video/ogg" ||
      mime === "video/mkv" ||
      mime === "video/avi" ||
      mime === "video/wmv" ||
      mime === "video/flv" ||
      mime === "video/x-matroska" ||
      mime === "video/webm") &&
    (ext === ".mp4" ||
      ext === ".ogg" ||
      ext === ".webm" ||
      ext === ".mov" ||
      ext === ".avi" ||
      ext === ".wmv" ||
      ext === ".flv" ||
      ext === ".mkv")
  ) {
    return "video";
  } else if (
    (mime === "audio/mp3" || mime === "audio/ogg" || mime === "audio/webm") &&
    (ext === ".mp3" ||
      ext === ".ogg" ||
      ext === ".webm" ||
      ext === ".wav" ||
      ext === ".flac" ||
      ext === ".aac" ||
      ext === ".m4a" ||
      ext === ".wma" ||
      ext === ".mka" ||
      ext === ".m3u" ||
      ext === ".mpga" ||
      ext === ".mp2" ||
      ext === ".m2a" ||
      ext === ".m3a" ||
      ext === ".ac3" ||
      ext === ".a52" ||
      ext === ".aiff" ||
      ext === ".aif" ||
      ext === ".wav" ||
      ext === ".flac" ||
      ext === ".aac" ||
      ext === ".m4a" ||
      ext === ".wma" ||
      ext === ".mka" ||
      ext === ".m3u" ||
      ext === ".mpga" ||
      ext === ".mp2" ||
      ext === ".m2a" ||
      ext === ".m3a" ||
      ext === ".ac3" ||
      ext === ".a52" ||
      ext === ".aiff" ||
      ext === ".aif")
  ) {
    return "audio";
  }
  if (
    (mime === "image/jpeg" ||
      mime === "image/png" ||
      mime === "image/gif" ||
      mime === "image/webp" ||
      mime === "image/jpg" ||
      mime === "image/svg") &&
    (ext === ".jpg" ||
      ext === ".png" ||
      ext === ".gif" ||
      ext === ".jpeg" ||
      ext === ".JPG" ||
      ext === ".PNG" ||
      ext === ".GIF" ||
      ext === ".JPEG" ||
      ext === ".webp" ||
      ext === ".WEBP" ||
      ext === ".svg" ||
      ext === ".SVG")
  ) {
    return "image";
  } else {
    return "document";
  }
};

module.exports = getFileTypeFromMime;
