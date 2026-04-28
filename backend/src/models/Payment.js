const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
    amount: Number,
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    method: {
        type: String,
        enum: ["cash", "upi", "card", "netbanking"],
    },
    note: String,
});

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },

        totalFees: Number,

        paidAmount: {
            type: Number,
            default: 0,
        },

        dueAmount: Number,

        // ✅ ADD THIS FIELD HERE
        status: {
            type: String,
            enum: ["pending", "partial", "paid"],
            default: "pending",
        },

        installments: [installmentSchema],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
