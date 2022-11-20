const express = require("express");
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
const { User } = require("../../models/user.model");

router.post("/", async (req, res) => {
  const { error } = validateBody(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is incorrect");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Email or password is incorrect");

  const token = user.generateAuthToken();
  res.send({ token });
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

function validateBody(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(3).max(255),
    password: Joi.string().required().min(4).max(255),
  });

  return schema.validate(user);
}

module.exports = router;
