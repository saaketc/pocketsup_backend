const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrl: String,
  goalAmount: { type: Number, required: true, default: 0 },
  fundRaised: { type: Number, required: true, default: 0 },
  perks: [{ amount: Number, perkDescription: String }],
  duration: { type: Number, default: 15 },
  startDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  endDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId },
  status: { type: String, default: 'active'}
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
