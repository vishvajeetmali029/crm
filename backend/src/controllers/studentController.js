const Student = require("../models/Student");
const Enquiry = require("../models/Enquiry");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

function buildStudentPassword(enquiry) {
    if (enquiry.phone && enquiry.phone.trim()) {
        return enquiry.phone.trim();
    }

    if (enquiry.email && enquiry.email.includes("@")) {
        return enquiry.email.split("@")[0];
    }

    return "student123";
}

exports.convertToStudent = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json("Enquiry not found");
        }

        // 🔍 Find course by name
        const course = await Course.findOne({
            name: enquiry.courseInterested,
        });

        if (!course) {
            return res.status(400).json("Course not found");
        }

        const existingStudent = await Student.findOne({ enquiryId: enquiry._id });

        if (existingStudent) {
            return res.status(400).json("Student already created from this enquiry");
        }

        const student = await Student.create({
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            course: course._id,
            enquiryId: enquiry._id,
        });

        await Payment.create({
            student: student._id,
            totalFees: course.fees,
            dueAmount: course.fees,
        });

        const loginEmail = enquiry.email.trim().toLowerCase();
        const plainPassword = buildStudentPassword(enquiry);
        let loginUser = await User.findOne({ email: loginEmail });

        if (!loginUser) {
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            loginUser = await User.create({
                name: enquiry.name,
                email: loginEmail,
                password: hashedPassword,
                role: "student",
            });
        }

        enquiry.status = "converted";
        await enquiry.save();

        res.json({
            message: "Student created",
            student,
            login: {
                email: loginUser.email,
                password: plainPassword,
                role: loginUser.role,
            },
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const students = await Student.find()
            .populate("course")
            .populate("batch")
            .skip(skip)
            .limit(limit);

        const total = await Student.countDocuments();

        res.json({
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getStudentById = async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
};

exports.getStudentProfile = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json("Email is required");
        }

        const student = await Student.findOne({
            email: email.trim().toLowerCase(),
        })
            .populate("course")
            .populate("batch");

        if (!student) {
            return res.status(404).json("Student not found");
        }

        res.json(student);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.updateStudent = async (req, res) => {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
};
