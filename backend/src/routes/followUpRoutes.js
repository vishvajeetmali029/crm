const router = require("express").Router();
const { addFollowUp } = require("../controllers/followUpController");

router.post("/", addFollowUp);

module.exports = router;
