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

router.get("/all", async (req, res) => {
  User.find()
    .select("-password")
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("Something went wrong"));
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

// updating a user
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

// Delete a user
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if the user exists
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).send("User not found");
    }

    // Prevent users from deleting themselves
    if (req.user._id.toString() === userToDelete._id.toString()) {
      return res.status(403).send("You cannot delete your own account");
    }

    // // Only allow admins to delete users
    // if (req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .send({ message: "Only admin users can delete accounts" });
    // }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while deleting the user");
  }
});

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
