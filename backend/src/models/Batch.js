const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
    {
        name: String,

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        startDate: Date,
        endDate: Date,

        capacity: Number,

        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Batch", batchSchema);
