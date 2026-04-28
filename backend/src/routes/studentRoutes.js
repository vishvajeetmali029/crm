const router = require("express").Router();
const {
    convertToStudent,
    getStudents,
    getStudentById,
    getStudentProfile,
    updateStudent,
} = require("../controllers/studentController");

router.post("/convert/:id", convertToStudent);
router.get("/", getStudents);
router.get("/profile/me", getStudentProfile);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);

module.exports = router;
