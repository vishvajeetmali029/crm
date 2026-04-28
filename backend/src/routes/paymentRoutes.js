const router = require("express").Router();
const {
    createPayment,
    addInstallment,
    getPaymentByStudent,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:studentId", getPaymentByStudent);
router.post("/installment/:paymentId", addInstallment);

module.exports = router;
