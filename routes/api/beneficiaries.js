let DoneeModel = require("../../models/beneficiaries.model");
let express = require("express");
let router = express.Router();
const path = require("path");
const _data = require("../../lib/data");
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
    nationality,
    role,
    gender,
    password,
    bank_details,
    validID,
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
      nationality &&
      role &&
      gender &&
      password
    )
  ) {
    return res.status(400).send("Required fields missing");
  }

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
    password,
  });

  newDonee
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      res.status(400).send("Phone, email, nin is not unique, already exits");
    });
});

// find donee by id
router.get("one/:id/", (req, res) => {
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
