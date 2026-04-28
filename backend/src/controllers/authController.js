const User = require("../models/User");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function normalizeRole(role) {
    if (role === "counsellor") {
        return "counselor";
    }

    return role || "student";
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const { phone, course } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json("Name, email and password are required");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json("User already exists");
        }

        const hashed = await bcrypt.hash(password, 10);

        const normalizedRole = normalizeRole(role);
        let student = null;
        let selectedCourse = null;

        if (normalizedRole === "student") {
            if (!phone || !course) {
                return res
                    .status(400)
                    .json("Phone and course are required for student registration");
            }

            selectedCourse = await Course.findById(course);

            if (!selectedCourse) {
                return res.status(400).json("Selected course not found");
            }
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashed,
            role: normalizedRole,
        });

        if (normalizedRole === "student") {
            student = await Student.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: phone.trim(),
                course: selectedCourse._id,
            });

            await Payment.create({
                student: student._id,
                totalFees: selectedCourse.fees,
                dueAmount: selectedCourse.fees,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: student?._id || null,
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json("Email and password are required");
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(400).json("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json("Invalid credentials");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secret",
            {
                expiresIn: "1d",
            },
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};
