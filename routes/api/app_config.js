const router = require("express").Router();
const path = require("path");
const _data = require("../../lib/data");
const getFileTypeFromMime = require("../../hooks/getFileType");
const fs = require("fs");

const GalleryModel = require("../../models/gallery.model");

// app_config Data get all
router.route("/").get((req, res) => {
  _data.read("app_config", "data", (err, app_configData) => {
    if (!err && app_configData) {
      res.json(app_configData);
    } else {
      res.status(400).json({ Error: "file does not exists" });
    }
  });
});

// app_config data update
router.put("/", async (req, res) => {
  // app_config data Object from frontend
  const app_configObject = req.body;

  _data.read("app_config", "data", (err, app_configData) => {
    if (!err && app_configData) {
      if (
        JSON.stringify(app_configObject.Header) !=
        JSON.stringify(app_configData.Header)
      ) {
        app_configData.Header = app_configObject.Header;
      } else if (
        JSON.stringify(app_configObject.About) !=
        JSON.stringify(app_configData.About)
      ) {
        app_configData.About = app_configObject.About;
      } else if (
        JSON.stringify(app_configObject.Gallery) !=
        JSON.stringify(app_configData.Gallery)
      ) {
        app_configData.Gallery = app_configObject.Gallery;
      } else if (
        JSON.stringify(app_configObject.Services) !=
        JSON.stringify(app_configData.Services)
      ) {
        app_configData.Services = app_configObject.Services;
      } else if (
        JSON.stringify(app_configObject.Testimonials) !=
        JSON.stringify(app_configData.Testimonials)
      ) {
        app_configData.Testimonials = app_configObject.Testimonials;
      }

      // store the new updates
      _data.update("app_config", "data", app_configData, (err) => {
        if (!err) {
          // callback(200);
          res.json(200);
        } else {
          console.log(err);
          callback(500, { Error: "Could not update the data" });
        }
      });
    } else {
      res.status(400).json({ Error: "file does not exists" });
    }
  });
});

// app_config data update -- founder
router.put("/founder", async (req, res) => {
  // app_config data Object from frontend
  const app_configObject = req.body;

  _data.read("app_config", "data", (err, app_configData) => {
    if (!err && app_configData) {
      if (
        JSON.stringify(app_configObject.Founder) !=
        JSON.stringify(app_configData.Founder)
      ) {
        app_configData.Founder = app_configObject.Founder;
      }

      // store the new updates
      _data.update("app_config", "data", app_configData, (err) => {
        if (!err) {
          // callback(200);
          res.json(200);
        } else {
          console.log(err);
          callback(500, { Error: "Could not update the data" });
        }
      });
    } else {
      res.status(400).json({ Error: "file does not exists" });
    }
  });
});

// app_config data update -- gallery
router.put("/gallery", async (req, res) => {
  if (!req.files) {
    return res.send({
      status: false,
      message: "No file uploaded",
    });
  }

  _data.deleteDir(".data/app_config/gallery/media", (err) => {
    if (!err) {
      try {
        _data.createDir(
          "media",
          _data.baseDir + "/app_config/gallery",
          async (err) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              // save event media to the dir
              try {
                await req.files.media.map((media, idx) => {
                  let newFile = media;

                  // get the file extension
                  const mediaLinkExt = path.extname(newFile.name);

                  // change the file name
                  newFile.name = `g${idx}${mediaLinkExt}`;

                  // function to get the mimetype of the file
                  const mediaLinkMime = newFile.mimetype;

                  //Use the mv() method to place the file in the course directory
                  const filePath = `.data/app_config/gallery/media/${newFile.name}`;
                  newFile.mv(filePath);

                  return {
                    path: filePath,
                    extName: mediaLinkExt,
                    mediaLinkMime,
                    name: newFile.name,
                    type: getFileTypeFromMime(mediaLinkMime, mediaLinkExt),
                  };
                });

                res.json("File Uploaded!");
              } catch (err) {
                return res.status(500).send(err);
              }
            }
          }
        );
      } catch (err) {
        res.status(500).send(err);
      }
    }
  });
});

// app_config home vid update
router.put("/uploadHomePageVid", async (req, res) => {
  if (!req.files) {
    return res.send({
      status: false,
      message: "No file uploaded",
    });
  }

  _data.delete(".data/app_config/homePageVid.mp4", (err) => {
    if (!err) {
      try {
        //Use the name of the input field (i.e. "newPhoto") to retrieve the uploaded file
        let newFile = req.files.media;
        newFile.name = "homePageVid.mp4";

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        const filePath = _data.baseDir + "app_config/" + newFile.name;
        newFile.mv(filePath);

        res.json("File Uploaded!");
      } catch (err) {
        res.status(500).send(err);
      }
    }
  });
});

// downloading home page video
router.get("/downloadHomePageVid/", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
});

router.get("/gallery/list", (req, res) => {
  const dirPath = path.join(
    _data.baseDirPath,
    ".data/app_config/gallery/media"
  );

  fs.readdir(dirPath, (err, files) => {
    if (err)
      return res.status(500).json({ error: "Could not read media files" });

    const galleryFiles = files.map((file) => ({
      name: file,
      url: `/static/gallery/${file}`,
    }));

    res.json(galleryFiles);
  });
});

router.delete("/gallery/:imageName", (req, res) => {
  const imagePath = `.data/app_config/gallery/media/${req.params.imageName}`;

  _data.delete(imagePath, (err) => {
    if (err) {
      return res
        .status(404)
        .json({ error: "Image not found or already deleted" });
    }
    res.json({ message: "Image deleted successfully" });
  });
});

module.exports = router;
