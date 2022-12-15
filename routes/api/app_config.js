const router = require("express").Router();
const path = require("path");
const _data = require("../../lib/data");

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

// downloading home page video
router.get("/downloadHomePageVid/", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
