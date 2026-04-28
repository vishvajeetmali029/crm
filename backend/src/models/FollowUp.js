const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
    {
        enquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enquiry",
        },
        note: String,
        nextFollowUpDate: Date,
        status: String,
    },
    { timestamps: true },
);

module.exports = mongoose.model("FollowUp", followUpSchema);
