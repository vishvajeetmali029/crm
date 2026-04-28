const Payment = require("../models/Payment");

// 🆕 Create payment record (when student joins)
exports.createPayment = async (req, res) => {
    try {
        const { studentId, totalFees } = req.body;

        const payment = await Payment.create({
            student: studentId,
            totalFees,
            dueAmount: totalFees,
        });

        res.json(payment);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.addInstallment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, method, note } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json("Payment record not found");
        }

        // ✅ ADD THIS CHECK HERE
        if (payment.paidAmount + amount > payment.totalFees) {
            return res.status(400).json("Payment exceeds total fees");
        }

        payment.installments.push({
            amount,
            method,
            note,
        });

        payment.paidAmount += amount;
        payment.dueAmount = payment.totalFees - payment.paidAmount;

        // ✅ ADD AFTER updating paidAmount & dueAmount

        if (payment.paidAmount === 0) {
            payment.status = "pending";
        } else if (payment.paidAmount < payment.totalFees) {
            payment.status = "partial";
        } else {
            payment.status = "paid";
        }

        await payment.save();

        res.json(payment);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.getPaymentByStudent = async (req, res) => {
    const payment = await Payment.findOne({
        student: req.params.studentId,
    }).populate("student");

    res.json(payment);
};
