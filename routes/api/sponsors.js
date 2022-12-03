const express = require("express");
const router = express.Router();
const SponsorsModel = require("../../models/sponsors.model");
const logger = require("../../startup/logging");

// get all Sponsors
router.get("/", async (req, res) => {
  SponsorsModel.find()
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("try again later"));
});

// get by ID
router.get("/sponsorByID/:id", function (req, res) {
  SponsorsModel.findById(req.params.id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// add a new Sponsor
router.post("/", async (req, res) => {
  const { first_name, last_name, email, occupation } = req.body;

  // validating if there is req.body
  if (!(first_name && last_name && email)) {
    return res.status(400).send("Required fields missing");
  }

  const newSponsor = new SponsorsModel({
    first_name,
    last_name,
    email,
    occupation,
  });

  newSponsor
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      res.status(500).send("try again later");
    });
});

module.exports = router;
