let RateModel = require("../../models/courseRating.model");
let express = require("express");
let router = express.Router();

router.post("/", async (req, res) => {
  //req.body
  if (!req.body) {
    return res.status(400).send("request body is missing");
  }

  const newPost = await new RateModel({
    course: req.body.course,
    student: req.body.student,
    courseRate: req.body.courseRate,
    feedback: req.body.feedback,
    suggestion: req.body.suggestion,
  });

  newPost
    .save()
    .then((doc) => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc);
      }
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// find by id
router.get("/byId/:id/", (req, res) => {
  RateModel.findOne({ _id: req.params.id })
    .populate({
      path: "student",
      model: "User",
      select: ["role", "email", "first_name", "last_name"],
    })
    .populate({ path: "course", model: "courses" })
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/", (req, res) => {
  RateModel.find()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//  get by course
router.get("/byCourse", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;
  RateModel.find({
    course: req.query.course,
    status: true,
  })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    // .populate({
    //   path: "student",
    //   model: "User",
    //   select: ["role", "email", "first_name", "last_name"],
    // })
    // .populate({ path: "course", model: "courses" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

router.put("/", (req, res) => {
  RateModel.updateOne(
    {
      _id: req.query.id,
    },
    req.body,
    { new: true }
  )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/categories", (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  RateModel.find()
    .then((doc) => {
      // res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      res.setHeader("Content-Range", "users 0-5/5");
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
