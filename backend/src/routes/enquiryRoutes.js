const router = require("express").Router();
const {
    createEnquiry,
    getEnquiries,
    getEnquiryById,
    updateEnquiry,
    convertToStudent,
} = require("../controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getEnquiries);
router.get("/:id", getEnquiryById);
router.put("/:id", updateEnquiry);
router.put("/convert/:id", convertToStudent);

module.exports = router;
