const express = require("express");
const router = express.Router();
const Gallery = require("../../models/galery.model");

router.get("/", (req, res) => {
  Gallery.find()
    .then((docs) => res.status(200).json(docs))
    .catch((err) => res.status(500).send("try again later"));
});
module.exports = router;
