const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const logger = require("../../startup/logging");
const auth = require("../../middleware/auth");
const { User, validate } = require("../../models/Users.model");
const jwtSign = (id) => {
  return jwt.sign({ id }, process.env.jwtPrivateKey, {
    expiresIn: "2h",
  });
};

router.get("/", async (req, res) => {
  const user = await User.find().select("-password");
  res.send(user);
});

// register a user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exists");

  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    phone: req.body.phone,
    gender: req.body.gender,
    dob: req.body.dob,
    name: `${req.body.last_name} ${req.body.first_name}`,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();
  const token = newUser.generateAuthToken();
  res.header("x-auth-token", token).send({ token });
});

// login
// router.post("/login", async (req, res) => {
//   try {
//     // get data from FE
//     const { email, password } = req.body;

//     // validation
//     if (!(email && password)) {
//       res.status(400).send("missing required fields");
//     }

//     // find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).send("user does not exists");
//     }

//     // match password
//     if (user && bcrypt.compare(password, user.password)) {
//       const token = jwtSign(user._id);
//       user.token = token;
//       user.password = undefined;

//       // send a token & cookie
//       const options = {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
//         httpOnly: true,
//       };

//       return res.status(200).cookie("token", token, options).json({
//         success: true,
//         token,
//         user,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get("/all", async (req, res) => {
  User.find()
    .select("-password")
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("Something went wrong"));
});

// router.get("/:id", async (req, res) => {
//   try {
//     // console.log(req.user);
//     const user = await User.findById(req.params.id).select("-password");
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send("Something went wrong");
//   }
// });

// updating a donee
router.put("/update/:id/", (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      delete doc.password;
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// router.get("/auth", auth, async (req, res) => {
//   try {
//     console.log(req.user);
//     const user = await User.findById(req.user._id).select("-password");
//     res.send(user);
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });
router.post("/verifyPassword/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("password");
  if (!user) return res.status(400).send("Invalid ID");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  res.send(isValid);
});

router.post("/changePassword/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid ID");
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);
  user.password = newPassword;
  user = await user.save();
  res.send("password changed successfully");
});

router.get("/dashborad", auth, (req, res) => {
  res.send("Success");
});

module.exports = router;
