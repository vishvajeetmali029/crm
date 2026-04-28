const Batch = require("../models/Batch");
const Student = require("../models/Student");

// ➕ Create batch
exports.createBatch = async (req, res) => {
    const batch = await Batch.create(req.body);
    res.json(batch);
};

// 📋 Get all batches
exports.getBatches = async (req, res) => {
    const batches = await Batch.find().populate("course").populate("students");

    res.json(batches);
};

// ➕ Assign student to batch
exports.assignStudent = async (req, res) => {
    const { batchId, studentId } = req.body;

    const student = await Student.findById(studentId);
    const batch = await Batch.findById(batchId);

    if (!student) {
        return res.status(404).json("Student not found");
    }

    if (!batch) {
        return res.status(404).json("Batch not found");
    }

    if (student.batch && student.batch.toString() === batchId) {
        return res.json({ message: "Student already assigned", batch });
    }

    if (batch.students.length >= batch.capacity) {
        return res.status(400).json("Batch is full");
    }

    if (student.batch) {
        await Batch.findByIdAndUpdate(student.batch, {
            $pull: { students: student._id },
        });
    }

    batch.students.addToSet(studentId);
    await batch.save();

    student.batch = batch._id;
    await student.save();

    res.json({ message: "Student added to batch", batch });
};
