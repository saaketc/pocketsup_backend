const mongoose = require("mongoose");

const fundingSchema = new mongoose.Schema({
  fundingUserId: { type: mongoose.Schema.Types.ObjectId },
  campaignId: { type: mongoose.Schema.Types.ObjectId },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: new Date().toUTCString() },
});

const Funding = mongoose.model("Funding", fundingSchema);
module.exports = Funding;
