const Enquiry = require("../models/Enquiry");
const FollowUp = require("../models/FollowUp");

// ➕ Create enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.json(enquiry);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// 📋 Get all enquiries
exports.getEnquiries = async (req, res) => {
    const enquiries = await Enquiry.find().populate("assignedTo");
    res.json(enquiries);
};

// 🔍 Get single enquiry with follow-ups
exports.getEnquiryById = async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);
    const followUps = await FollowUp.find({ enquiryId: req.params.id });

    res.json({ enquiry, followUps });
};

// ✏️ Update enquiry
exports.updateEnquiry = async (req, res) => {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
};

// 🔁 Convert enquiry → student
exports.convertToStudent = async (req, res) => {
    const enquiry = await Enquiry.findById(req.params.id);

    enquiry.status = "converted";
    await enquiry.save();

    // Later we’ll create Student entry here
    res.json({ message: "Converted to student", enquiry });
};
