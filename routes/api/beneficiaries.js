let DoneeModel = require("../../models/beneficiaries.model");
let express = require("express");
let router = express.Router();
const path = require("path");
const _data = require("../../lib/data");
const getFileTypeFromMime = require("../../hooks/getFileType");
const logger = require("../../startup/logging");

// add new Donee
router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    levelOfEduc,
    email,
    phone,
    dob,
    role,
    gender,
    validID,
    employment_history,
    skills,
    id_no,
    idType,
    story,
  } = req.body;

  // validating if there is req.body
  if (
    !(
      first_name &&
      last_name &&
      levelOfEduc &&
      email &&
      phone &&
      dob &&
      role &&
      gender &&
      story
    )
  ) {
    return res.status(400).send("Required fields missing");
  }

  const nationality = {
    nationality: req.body.nationality,
    stateOfOrigin: req.body.stateOfOrigin,
    localGovernmentArea: req.body.localGovernmentArea,
    residentialAddress: {
      houseNo: req.body.houseNo,
      street: req.body.street,
      state: req.body.state,
      country: req.body.country,
    },
  };

  const bank_details = {
    acct_no: req.body.acct_no,
    acct_name: req.body.acct_name,
    bank: req.body.bank,
  };

  const newDonee = await new DoneeModel({
    first_name,
    last_name,
    name: `${first_name} ${last_name}`,
    levelOfEduc,
    email,
    phone,
    dob: Date.parse(dob),
    nationality,
    role,
    gender,
    bank_details,
    validID,
    employment_history,
    skills,
    story,
  });

  const doneeDir = newDonee._id;

  function saveToDB() {
    // Save the new module to database
    newDonee
      .save()
      .then((doc) => res.status(200).json(doc))
      .catch((err) => {
        _data.deleteDir(`.data/donee/${doneeDir}`, (delerr) => {
          if (delerr) console.log(delerr);
          res
            .status(400)
            .send("Phone, email, nin is not unique, already exits");
        });
      });
  }

  // Save the Avatar to a dir
  _data.createDir(doneeDir, _data.baseDir + "/donee", async (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // save course image to the dir
      try {
        if (req.files) {
          if (req.files.ID_image) {
            let newFile = req.files.ID_image;

            // get the file extension
            const ID_imageLinkExt = path.extname(newFile.name);

            // change the file name
            newFile.name = `validID${ID_imageLinkExt}`;

            // function to get the mimetype of the file
            const ID_imageLinkMime = newFile.mimetype;

            //Use the mv() method to place the file in the donee directory
            const filePath = `.data/donee/${doneeDir}/${newFile.name}`;
            newFile.mv(filePath);

            // save the media proterties arr in the document
            newDonee.validID = {
              id_no: id_no,
              id_type: idType,
              path: filePath,
              extName: ID_imageLinkExt,
              ID_imageLinkMime,
              name: newFile.name,
              type: getFileTypeFromMime(ID_imageLinkMime, ID_imageLinkExt),
            };
          }
          if (req.files.avatar) {
            let newFile = req.files.avatar;

            // get the file extension
            const avatarLinkExt = path.extname(newFile.name);

            // change the file name
            newFile.name = `avatar${avatarLinkExt}`;

            // function to get the mimetype of the file
            const avatarLinkMime = newFile.mimetype;

            //Use the mv() method to place the file in the donee directory
            const filePath = `.data/donee/${doneeDir}/${newFile.name}`;
            newFile.mv(filePath);

            // save the media proterties arr in the document
            newDonee.avatar = {
              path: filePath,
              extName: avatarLinkExt,
              avatarLinkMime,
              name: newFile.name,
              type: getFileTypeFromMime(avatarLinkMime, avatarLinkExt),
            };
          }

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

// find donee by id
router.get("/one/:id/", (req, res) => {
  DoneeModel.findOne({ _id: req.params.id })
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

//  get all donees
router.get("/", (req, res) => {
  DoneeModel.find()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

//  get all verified donees
router.get("/verified", (req, res) => {
  DoneeModel.find({ isVerified: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

//  get all verified donees by role with pagination
router.get("/verified/list", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  DoneeModel.find({
    // role: req.query.role,
    isVerified: true,
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// counting the #of courses per instructor id
router.get("/verified/count/", (req, res) => {
  DoneeModel.find({
    // role: req.query.role,
    isVerified: true,
  })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

//  get all unverified donees
router.get("/unVerified", (req, res) => {
  DoneeModel.find({ isVerified: false })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

// Verifying a donee
router.put("/approval/:id/", (req, res) => {
  DoneeModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// updating a donee
router.put("/update/:id/", (req, res) => {
  DoneeModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// gey profile pic/avatar
router.get("/downloadProfilePic", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.put("/addProfilePic/:id", async (req, res) => {
  const dirname = req.query.fileName;
  const doneeDir = req.params.id;

  function addAvatar() {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded",
        });
      } else {
        // change the file name
        let newFile = req.files.profilePic;
        newFile.name = "profilePic.jpeg";

        //Use the mv() method to place the file in the course directory
        const filePath = `.data/${doneeDir}/${newFile.name}`;
        newFile.mv(filePath);

        DoneeModel.findOneAndUpdate(
          { _id: req.params.id },
          { pic: filePath },
          { new: true }
        )
          .then((doc) => {
            res.status(200).json(doc).send("File Uploaded!");
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  if (dirname === "assets/default.svg") {
    _data.createDir(doneeDir, _data.baseDir, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        addAvatar();
      }
    });
  } else {
    _data.delete(dirname, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        addAvatar();
      }
    });
  }
});

// counting the #of orphans
router.get("/count/orphans", (req, res) => {
  DoneeModel.find({
    role: "orphan",
  })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

// counting the #of widows
router.get("/count/widows", (req, res) => {
  DoneeModel.find({
    role: "widow",
  })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

// delete a donee
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
