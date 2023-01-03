const express = require("express");
const router = express.Router();
const Donations = require("../../models/donations.model");
const logger = require("../../startup/logging");

// get all Donations
router.get("/", async (req, res) => {
  Donations.find()
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("try again later"));
});

// get by ID
router.get("/transaction/:id", function (req, res) {
  Donations.findById(req.params.id)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// add a new Donations
router.post("/", async (req, res) => {
  const {
    name,
    email,
    status,
    flw_ref,
    tx_ref,
    amount,
    transaction_id,
    currency,
    purpose,
  } = req.body;

  // validating if there is req.body
  if (!email && amount) {
    return res.status(400).send("Required fields missing");
  }

  const newDonation = new Donations({
    name,
    email,
    status,
    flw_ref,
    tx_ref,
    amount,
    transaction_id,
    currency,
    purpose,
  });

  newDonation
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      res.status(500).send("try again later");
    });
});

module.exports = router;
