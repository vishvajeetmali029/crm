const FollowUp = require("../models/FollowUp");

// ➕ Add follow-up
exports.addFollowUp = async (req, res) => {
    const followUp = await FollowUp.create(req.body);
    res.json(followUp);
};
