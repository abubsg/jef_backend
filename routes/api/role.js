let express = require("express");
let router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
});

module.exports = router;
