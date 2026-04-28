const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            unique: true,
        },

        phone: {
            type: String,
        },

        // 🔗 Reference to Course
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        // 🔗 Reference to Batch
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
        },

        // 🎯 Lifecycle tracking
        status: {
            type: String,
            enum: ["active", "completed", "dropped"],
            default: "active",
        },

        // 🔗 Link back to enquiry
        enquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enquiry",
        },
    },
    { timestamps: true },
);

studentSchema.index({ name: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ batch: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model("Student", studentSchema);
