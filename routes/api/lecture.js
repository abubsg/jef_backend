const express = require("express");
const router = express.Router();
const CourseModel = require("../../models/beneficiaries.model");
const LectureModel = require("../../models/lectures.model");
const path = require("path");
const _data = require("../../lib/data");
const getFileTypeFromMime = require("../../hooks/getFileType");
const logger = require("../../startup/logging");

/*Get lecturesByCourseId*/
router.get("/lecturesByCourseId/:id", function (req, res) {
  LectureModel.find({
    course: req.params.id,
  })
    .populate({ path: "course", model: "courses", select: "courseDescription" })
    .then((doc) => {
      // res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      //res.setHeader('Content-Range', 'users 0-5/5');
      res.json(doc);
      // console.log("populated doc:" + doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/*Get lectures By ID*/
router.get("/lectureById/:id", function (req, res) {
  LectureModel.findById(req.params.id)
    .populate({ path: "course", model: "courses" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// add new module
router.post("/", async (req, res) => {
  // validating if there is req.body
  if (!req.body) {
    return res.status(400).send("Required fields missing");
  } else if (!req.files) {
    return res.status(400).send("course image missing");
  }

  const course = req.body.course;
  const moduleNo = req.body.moduleNo;
  const newModule = new LectureModel({
    title: req.body.title,
    mediaLink: req.body.mediaLink,
    mediaLinkExt: req.body.mediaLinkExt,
    videoLink: req.body.videoLink,
    contentType: req.body.contentType,
    description: req.body.description,
    externalLinks: req.body.externalLinks,
    tags: req.body.tags,
    objectives: req.body.objectives,
    moduleNo,
    course,

    capturedBy: req.body.capturedBy,
  });

  const moduleDir = newModule._id;

  // Save the media to a dir
  _data.createDir(moduleDir, _data.baseDir + "/" + course, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // save course image to the dir
      try {
        if (req.files) {
          const mediaLink = req.files.mediaLink.map((media, idx) => {
            let newFile = media;

            // get the file extension
            const mediaLinkExt = path.extname(newFile.name);

            // change the file name
            newFile.name = `module${moduleNo}${idx}${mediaLinkExt}`;

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

          // save the media proterties arr in the document
          newModule.mediaLink = mediaLink;

          // Save the new module to database
          newModule
            .save()
            .then((doc) => res.status(200).json(doc))
            .catch((err) => {
              _data.deleteDir(`.data/${course}/${moduleDir}`, () =>
                res.status(400).send("Course code is not unique, already exits")
              );
            });
        }
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  });
});

// downloading Module Media
router.get("/downloadLectureMedia/", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// counting the no of module for a course
router.get("/count/:id", (req, res) => {
  LectureModel.findOne({ course: req.params.id })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

// updating a module
router.put("/:id/", (req, res) => {
  LectureModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/changeLectureMaterials/:id", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files uploaded");
  }

  LectureModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
