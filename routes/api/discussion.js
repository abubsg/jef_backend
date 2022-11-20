let DiscussModel = require("../../models/discussion.model");
let express = require("express");
let router = express.Router();

router.post("/", async (req, res) => {
  //req.body
  if (!req.body) {
    return res.status(400).send("request body is missing");
  }

  const newPost = await new DiscussModel({
    course: req.body.course,
    student: req.body.student,
    postDescription: req.body.postDescription,
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

// // find by id
// router.route("/:id/").get((req, res) => {
//   DiscussModel.findOne({ _id: req.params.id })
//     .then((doc) => res.json(doc))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.get("/", (req, res) => {
  DiscussModel.find()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//  get by course
router.get("/byCourse/", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  DiscussModel.find({
    course: req.query.course,
    status: true,
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({
      path: "student",
      model: "User",
      // select: ["role", "email", "first_name", "last_name"],
    })
    .populate({ path: "course", model: "courses" })
    .populate({
      path: "comments.user",
      model: "User",
      select: ["role", "email", "first_name", "last_name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

// counting the #of discussions per course
router.get("/count/", (req, res) => {
  DiscussModel.findOne({ course: req.query.course })
    .count()
    .then((no) => res.json(no))
    .catch((err) => {
      res.status(400).json("invalid course id");
    });
});

// updating likes
router.put("/likes/", (req, res) => {
  DiscussModel.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        likes: req.body.likesDB,
      },
    },
    { new: true }
  )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// updating comment
router.put("/comments/", (req, res) => {
  const id = req.body.id;
  DiscussModel.findById(id)
    .then((doc) => {
      doc.comments.push({
        user: req.body.user,
        likes: [],
        comment: req.body.comment,
        date: req.body.date,
      });

      doc.save(function (err) {
        if (err) return res.status(400).json("Error: " + err);
        return res.json(doc);
      });
    })
    .catch((err) => res.status(500).send(err));
  // DiscussModel.findOneAndUpdate(
  //   { _id: req.body.id },
  //   {
  //     $set: {
  //       comments: [
  //         ...comments,

  //         {
  //           user: req.body.user,
  //           likes: [],
  //           comment: req.body.comment,
  //           date: req.body.date,
  //         },
  //         ,
  //       ],
  //     },
  //   },
  //   { new: true }
  // )
  //   .then((doc) => {
  //     res.json(doc);
  //   })
  //   .catch((err) => {
  //     res.status(500).json(err);
  //   });
});

// updating a course
// router.put("/likes/", (req, res) => {
//   DiscussModel.findOneAndUpdate(
//     { _id: req.body.id },
//     {
//       $inc: {
//         likes: req.body.likes,
//       },
//     },
//     { new: true }
//   )
//     .then((doc) => {
//       res.json(doc);
//     })
//     .catch((err) => {
//       res.status(500).json(err);
//     });
// });

router.put("/:id/", (req, res) => {
  DiscussModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        categoryName: req.body.categoryName,
      },
    }
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

  DiscussModel.find()
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
