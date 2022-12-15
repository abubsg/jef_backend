const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../../models/Users.model");
const logger = require("../../startup/logging");
const auth = require("../../middleware/auth");

const jwtSign = (id) => {
  return jwt.sign({ id }, process.env.jwtPrivateKey, {
    expiresIn: "2h",
  });
};

// register a user
router.post("/register", async (req, res) => {
  try {
    // get all data
    const { first_name, last_name, email, phone, dob, role, gender, password } =
      req.body;

    // validate data
    if (
      !(
        first_name &&
        last_name &&
        email &&
        phone &&
        dob &&
        role &&
        gender &&
        password
      )
    ) {
      res.status(400).send("Missing required fields");
    }

    // check if user exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).send("User already exists with this email");
    }

    // encript password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to DB
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      dob,
      role,
      gender,
      password: hashedPassword,
    });

    // generate token and send it
    // const token = jwt.sign({ id: user._id }, process.env.jwtPrivateKey, {
    //   expiresIn: "2h",
    // });
    const token = jwtSign(user._id);
    user.token = token;
    user.password = undefined;

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    // get data from FE
    const { email, password } = req.body;

    // validation
    if (!(email && password)) {
      res.status(400).send("missing required fields");
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("user does not exists");
    }

    // match password
    if (user && bcrypt.compare(password, user.password)) {
      const token = jwtSign(user._id);
      user.token = token;
      user.password = undefined;

      // send a token & cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
        httpOnly: true,
      };

      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/auth", auth, async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

router.get("/dashborad", auth, (req, res) => {
  res.send("Success");
});

module.exports = router;
