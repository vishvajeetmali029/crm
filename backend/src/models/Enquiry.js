const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        courseInterested: String,
        status: {
            type: String,
            enum: ["new", "contacted", "follow-up", "converted", "closed"],
            default: "new",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Enquiry", enquirySchema);
