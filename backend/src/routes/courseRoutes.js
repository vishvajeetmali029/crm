const router = require("express").Router();
const { createCourse, getCourses } = require("../controllers/courseController");

router.post("/", createCourse);
router.get("/", getCourses);

module.exports = router;
