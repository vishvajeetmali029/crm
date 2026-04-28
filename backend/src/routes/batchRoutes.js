const router = require("express").Router();
const {
    createBatch,
    getBatches,
    assignStudent,
} = require("../controllers/batchController");

router.post("/", createBatch);
router.get("/", getBatches);
router.post("/assign", assignStudent);

module.exports = router;
