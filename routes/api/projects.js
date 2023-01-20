const express = require("express");
const router = express.Router();
const ProjectsModel = require("../../models/projects.model");
const path = require("path");
const _data = require("../../lib/data");
const getFileTypeFromMime = require("../../hooks/getFileType");
const logger = require("../../startup/logging");

// get all events
router.get("/all", async (req, res) => {
  ProjectsModel.find()
    // .where(startDate)
    .populate({
      path: "postedBy",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("try again later"));
});

// get all future events
router.get("/allFuture", async (req, res) => {
  ProjectsModel.find()
    .populate({
      path: "postedBy",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("try again later"));
});

/*Get events By ID (month)*/
router.get("/eventsByID/:id", function (req, res) {
  ProjectsModel.findById(req.params.id)
    .populate({
      path: "postedBy",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/*Get events By date (month)*/
// router.get("/eventsByDate/", function (req, res) {
//   ProjectsModel.findById(req.params.id)
//     .populate({
//       path: "postedBy",
//       model: "User",
//       select: ["role", "email", "first_name", "last_name", "name"],
//     })
//     .then((doc) => {
//       res.json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json(err);
//     });
// });

// add a new event
router.post("/", async (req, res) => {
  const {
    postedBy,
    category,
    description,
    title,
    startDate,
    endDate,
    address,
    longitude,
    latitude,
  } = req.body;
  // validating if there is req.body
  if (!(postedBy && description && title && startDate)) {
    return res.status(400).send("Required fields missing");
  }

  const newEvent = new ProjectsModel({
    postedBy,
    category,
    description,
    address,
    longitude,
    latitude,
    title,
    startDate,
    endDate,
    upload: [],
    uploadPrp: [],
  });

  const eventsDir = newEvent._id;

  function saveToDB() {
    // Save the new module to database
    newEvent
      .save()
      .then((doc) => res.status(200).json(doc))
      .catch((err) => {
        _data.deleteDir(`.data/projects/${eventsDir}`, () =>
          res.status(500).send("try again later")
        );
      });
  }

  // Save the media to a dir
  _data.createDir(eventsDir, _data.baseDir + "/projects", async (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // save course image to the dir
      try {
        if (req.files) {
          const mediaLink = await req.files.mediaLink.map((media, idx) => {
            let newFile = media;

            // get the file extension
            const mediaLinkExt = path.extname(newFile.name);

            // change the file name
            newFile.name = `event_${title}_${idx}${mediaLinkExt}`;

            // function to get the mimetype of the file
            const mediaLinkMime = newFile.mimetype;

            //Use the mv() method to place the file in the course directory
            const filePath = `.data/projects/${eventsDir}/${newFile.name}`;
            newFile.mv(filePath);

            return {
              path: filePath,
              extName: mediaLinkExt,
              mediaLinkMime,
              name: newFile.name,
              type: getFileTypeFromMime(mediaLinkMime, mediaLinkExt),
            };
          });

          const mediaLinkPrp = await req.files.mediaLinkPrp.map(
            (media, idx) => {
              let newFilePrp = media;

              // get the file extension
              const mediaLinkExtPrp = path.extname(newFilePrp.name);

              // change the file name
              newFilePrp.name = `event_${title}_${idx}_P${mediaLinkExtPrp}`;

              // function to get the mimetype of the file
              const mediaLinkMimePrp = newFilePrp.mimetype;

              //Use the mv() method to place the file in the course directory
              const filePath = `.data/projects/${eventsDir}/${newFilePrp.name}`;
              newFilePrp.mv(filePath);

              return {
                path: filePath,
                extName: mediaLinkExtPrp,
                mediaLinkMime: mediaLinkMimePrp,
                name: newFilePrp.name,
                type: getFileTypeFromMime(mediaLinkMimePrp, mediaLinkExtPrp),
              };
            }
          );

          // save the media proterties arr in the document
          newEvent.upload = mediaLink;
          newEvent.uploadPrp = mediaLinkPrp;

          saveToDB();
        } else {
          saveToDB();
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    }
  });
});

// downloading Event Media
router.get("/downloadEventMedia/", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// updating an event
router.put("/details/:id/", (req, res) => {
  ProjectsModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// in progress
router.put("/changeEventMedia/:id", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files uploaded");
  }

  ProjectsModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  })
    .then(async (doc) => {
      const course = doc.course;
      const moduleDir = doc._id;

      try {
        const deletedMediaLink = await doc.mediaLink.map((media) => {
          const dirname = media.path;

          _data.delete(dirname, (err) => {
            if (err) console.log(err);
          });
        });

        const mediaLink = await req.files.mediaLink.map((media, idx) => {
          let newFile = media;

          // get the file extension
          const mediaLinkExt = path.extname(newFile.name);

          // change the file name
          newFile.name = `module${doc.moduleNo}${idx}${mediaLinkExt}`;

          // function to get the mimetype of the file
          const mediaLinkMime = newFile.mimetype;

          //Use the mv() method to place the file in the course directory
          const filePath = `.data/${course}/${moduleDir}/${newFile.name}`;
          newFile.mv(filePath);

          return {
            path: filePath,
            extName: mediaLinkExt,
            mediaLinkMime,
            name: newFile.name,
            type: getFileTypeFromMime(mediaLinkMime, mediaLinkExt),
          };
        });

        doc.mediaLink = mediaLink;

        doc
          .save()
          .then((doc) => res.status(200).json(doc))
          .catch((err) => {
            return res
              .status(500)
              .send("Could not update module materials. Try again later");
          });
      } catch (err) {
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
