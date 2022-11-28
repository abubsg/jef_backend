let DoneeModel = require("../../models/beneficiaries.model");
let express = require("express");
let router = express.Router();
const path = require("path");
const _data = require("../../lib/data");
const logger = require("../../startup/logging");

// add new course
router.post("/", async (req, res) => {
  // validating if there is req.body
  if (!req.body) {
    return res.status(400).send("Required fields missing");
  } else if (!req.files) {
    return res.status(400).send("course image missing");
  }

  const newCourse = await new DoneeModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    name: req.body.name,
    levelOfEduc: req.body.levelOfEduc,
    email: req.body.email,
    phone: req.body.phone,
    dob: Date.parse(req.body.dob),
    nationality: req.body.nationality,
    role: req.body.role,
    gender: req.body.gender,
    employment_history: {},
    bank_details: {},
    skills: {},
    validID: {
      id_type: "NIN",
      id_no: "NIN9048509835809850940",
    },

    password: req.body.password,
  });
  const courseDir = newCourse._id;

  // Save the media to a dir
  _data.createDir(courseDir, _data.baseDir, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // save course image to the dir
      try {
        if (req.files) {
          // change the file name
          let newFile = req.files.courseImage;
          newFile.name = "courseImage.jpeg";

          //Use the mv() method to place the file in the course directory
          const filePath = `.data/${courseDir}/${newFile.name}`;
          newFile.mv(filePath);

          // save the courseImage path in the document
          newCourse.courseImage = filePath;

          // Save the new course data
          newCourse
            .save()
            .then((doc) => res.status(200).json(doc))
            .catch((err) => {
              _data.deleteDir(`.data/${courseDir}`, () =>
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

//  get all
router.get("/", (req, res) => {
  DoneeModel
    .find
    // { status: true }
    ()
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

//  get by category
router.get("/byCategory", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  DoneeModel.find({
    category: req.query.category,
    status: true,
  })
    // .where({ course: !["625435c1d055f528c7a3571f", "625435c1d055f528c7a3571f"] })
    // .deleteMany({ course: ["625435c1d055f528c7a3571f"] }, { limit: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({ path: "category", model: "category", select: "categoryName" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.get("/downloadCourseImage", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.put("/changeCourseImage/:id", (req, res) => {
  const dirname = req.query.fileName;
  const courseDir = req.params.id;

  _data.delete(dirname, (err) => {
    if (err) console.log(err);

    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        // change the file name
        let newFile = req.files.courseImage;
        newFile.name = "courseImage.jpeg";

        //Use the mv() method to place the file in the course directory
        const filePath = `.data/${courseDir}/${newFile.name}`;
        newFile.mv(filePath);

        res.send("File Uploaded!");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

// find by id
router.route("/:id/").get((req, res) => {
  DoneeModel.findOne({ _id: req.params.id })
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get courses by instructor id
router.get("/instructor/:id/", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  DoneeModel.find({
    instructor: req.params.id,
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// counting the #of courses per instructor id
router.get("/instructor/count/:id", (req, res) => {
  DoneeModel.find({
    instructor: req.params.id,
  })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

// updating a course
router.put("/:id/", (req, res) => {
  DoneeModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id/", (req, res) => {
  DoneeModel.findOneAndRemove({
    _id: req.params.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
